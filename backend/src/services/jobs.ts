import { Queue, Worker, Job } from 'bullmq';
import IORedis from 'ioredis';
import { db } from './db';
import { generateAssessmentPaper } from './ai';
import { getSocketServer } from './socket';

let redisConnection: IORedis | null = null;
let assignmentQueue: Queue | null = null;
let bullWorker: Worker | null = null;
let isRedisConnected = false;

// Stage descriptions matching implementation.md exactly
export const STAGES = [
  { stage: "Analyzing your requirements...", percentage: 15 },
  { stage: "Crafting question structure...", percentage: 40 },
  { stage: "Generating questions with AI...", percentage: 70 },
  { stage: "Organizing sections & difficulty...", percentage: 85 },
  { stage: "Finalizing your question paper...", percentage: 100 }
];

export async function initJobs() {
  const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
  let warnedOnce = false;

  try {
    redisConnection = new IORedis(redisUrl, {
      maxRetriesPerRequest: null,
      connectTimeout: 2000,
      retryStrategy: () => null,
      lazyConnect: true,
    });

    // Register listeners BEFORE connect() to avoid unhandled error events
    redisConnection.on('connect', () => {
      console.log('✅ Redis connected. Using BullMQ job processor.');
      isRedisConnected = true;
      setupBullMQ();
    });

    redisConnection.on('error', () => {
      if (!warnedOnce) {
        warnedOnce = true;
        console.warn('⚠️  Redis unavailable — using IN-MEMORY job processor (no data loss).');
        isRedisConnected = false;
      }
    });

    // Attempt single connection — error handled by listener above
    await redisConnection.connect().catch(() => {});
  } catch {
    if (!warnedOnce) {
      warnedOnce = true;
      console.warn('⚠️  Redis init error — using IN-MEMORY job processor.');
    }
    isRedisConnected = false;
  }
}

function setupBullMQ() {
  if (!redisConnection) return;
  
  assignmentQueue = new Queue('assignments', { connection: redisConnection });
  
  bullWorker = new Worker('assignments', async (job: Job) => {
    const { assignmentId } = job.data;
    await processAssignmentJob(assignmentId, (stage, percent) => {
      job.updateProgress(percent);
      const io = getSocketServer();
      if (io) {
        io.to(assignmentId).emit('job:progress', { jobId: job.id, stage, percentage: percent });
      }
    });
  }, { connection: redisConnection });

  bullWorker.on('completed', (job) => {
    console.log(`Job ${job.id} completed successfully!`);
    const io = getSocketServer();
    if (io) {
      io.to(job.data.assignmentId).emit('job:complete', { jobId: job.id, assignmentId: job.data.assignmentId });
    }
  });

  bullWorker.on('failed', (job, err) => {
    console.error(`Job ${job?.id} failed:`, err);
    const io = getSocketServer();
    if (io && job) {
      io.to(job.data.assignmentId).emit('job:failed', { jobId: job.id, error: err.message });
    }
  });
}

/**
 * Common logic to process the assignment (AI generation + database update)
 */
export async function processAssignmentJob(
  assignmentId: string,
  onProgress: (stage: string, percentage: number) => void
) {
  const assignment = await db.getAssignment(assignmentId);
  if (!assignment) {
    throw new Error(`Assignment with ID ${assignmentId} not found`);
  }

  await db.updateAssignment(assignmentId, { status: 'processing' });

  // Run stages with artificial delays to provide great visual updates
  for (const step of STAGES) {
    onProgress(step.stage, step.percentage);
    // If it's the AI generation stage, invoke the AI service
    if (step.stage === "Generating questions with AI...") {
      try {
        const generatedPaper = await generateAssessmentPaper(assignment);
        await db.updateAssignment(assignmentId, {
          generatedPaper,
          status: 'completed'
        });
      } catch (err: any) {
        await db.updateAssignment(assignmentId, { status: 'failed' });
        throw err;
      }
    }
    // Artificial delay for slick UI
    await new Promise(resolve => setTimeout(resolve, 1500));
  }

  await db.updateAssignment(assignmentId, { status: 'completed' });
}

/**
 * Adds a new job. Falls back to in-process async processing if Redis is unavailable.
 */
export async function addAssignmentJob(assignmentId: string): Promise<string> {
  const jobId = 'job_' + Math.random().toString(36).substring(2, 11);
  await db.updateAssignment(assignmentId, { jobId, status: 'pending' });

  if (isRedisConnected && assignmentQueue) {
    try {
      const job = await assignmentQueue.add('generate', { assignmentId }, { jobId });
      return job.id || jobId;
    } catch (err) {
      console.error('Failed to add to BullMQ queue, falling back to memory execution:', err);
    }
  }

  // Fallback: In-memory async job simulation
  console.log(`[Job Manager] Starting in-memory job processing for assignment ${assignmentId}`);
  
  // Execute async background processing without blocking request
  setTimeout(async () => {
    const io = getSocketServer();
    try {
      await processAssignmentJob(assignmentId, (stage, percentage) => {
        if (io) {
          io.to(assignmentId).emit('job:progress', { jobId, stage, percentage });
        }
      });
      if (io) {
        io.to(assignmentId).emit('job:complete', { jobId, assignmentId });
      }
    } catch (error: any) {
      console.error('In-memory job processing failed:', error);
      if (io) {
        io.to(assignmentId).emit('job:failed', { jobId, error: error.message });
      }
    }
  }, 500);

  return jobId;
}
