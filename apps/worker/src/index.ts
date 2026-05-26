import { Worker, Job } from 'bullmq';
import mongoose from 'mongoose';
import IORedis from 'ioredis';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
const pdfParse = require('pdf-parse');
import { generateAssessmentPaper } from '../../../backend/src/services/ai';
import { db, connectDB } from '../../../backend/src/services/db';

dotenv.config({ path: path.join(__dirname, '../.env') });
// fallback to backend .env if local is not present
if (!process.env.MONGODB_URI) {
  dotenv.config({ path: path.join(__dirname, '../../../backend/.env') });
}

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

async function startWorker() {
  console.log('👷 Standalone worker starting...');
  
  // Connect DB (falls back to in-memory automatically)
  await connectDB();

  try {
    const connection = new IORedis(REDIS_URL, {
      maxRetriesPerRequest: null,
      connectTimeout: 3000,
      retryStrategy: () => null,
      lazyConnect: true,
    });

    // Register error listener BEFORE connect() to avoid unhandled error events
    connection.on('error', () => {
      // Silently handled — connection attempt is resolved via try/catch below
    });

    connection.on('connect', () => {
      console.log('👷 Redis connected — BullMQ Worker active.');
      
      const worker = new Worker('assignments', async (job: Job) => {
        const { assignmentId } = job.data;
        console.log(`Processing job ${job.id} for assignment ${assignmentId}`);
        
        const assignment = await db.getAssignment(assignmentId);
        if (!assignment) throw new Error(`Assignment ${assignmentId} not found`);

        await db.updateAssignment(assignmentId, { status: 'processing' });
        
        try {
          let fileText = '';
          if (assignment.uploadedFilePath && fs.existsSync(assignment.uploadedFilePath)) {
            const buffer = fs.readFileSync(assignment.uploadedFilePath);
            if (path.extname(assignment.uploadedFilePath).toLowerCase() === '.pdf') {
              const data = await pdfParse(buffer);
              fileText = data.text;
            } else {
              fileText = buffer.toString('utf-8');
            }
          }

          const generatedPaper = await generateAssessmentPaper(assignment, fileText);
          await db.updateAssignment(assignmentId, { generatedPaper, status: 'completed' });
          console.log(`✅ Job ${job.id} completed.`);
        } catch (err: any) {
          await db.updateAssignment(assignmentId, { status: 'failed' });
          throw err;
        }
      }, { connection });

      worker.on('failed', (job, err) => console.error(`Job ${job?.id} failed:`, err));
      worker.on('completed', (job) => console.log(`Job ${job.id} done.`));
    });

    // Attempt connection — errors are handled silently above
    await connection.connect().catch(() => {
      console.warn('⚠️  Redis unavailable — standalone worker idle. Backend handles jobs in-memory.');
    });

  } catch (error) {
    console.warn('⚠️  Worker could not connect to Redis:', error);
  }
}

startWorker().catch(err => {
  console.error('Failed to start worker:', err);
});
