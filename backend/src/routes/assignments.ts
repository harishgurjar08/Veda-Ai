import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { db } from '../services/db';
import { addAssignmentJob } from '../services/jobs';
import { generatePDF } from '../services/pdf';
const pdfParse = require('pdf-parse');

const router = Router();

// Set up multer upload directory
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req: any, file: any, cb: any) => {
    cb(null, uploadDir);
  },
  filename: (req: any, file: any, cb: any) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Helper to extract text from files
async function extractFileText(filePath: string): Promise<string> {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.txt') {
    return fs.readFileSync(filePath, 'utf-8');
  } else if (ext === '.pdf') {
    const dataBuffer = fs.readFileSync(filePath);
    try {
      const data = await pdfParse(dataBuffer);
      return data.text;
    } catch (err) {
      console.error('Failed to parse PDF file:', err);
      return '';
    }
  }
  return '';
}

/**
 * POST /api/assignments
 * Accepts multipart form data, stores assignment, and enqueues generation job
 */
router.post('/', upload.single('uploadedFile'), async (req: Request, res: Response) => {
  try {
    const {
      subject,
      grade,
      topic,
      dueDate,
      questionTypes,
      numQuestions,
      marksPerQuestion,
      difficultyDistribution,
      additionalInstructions
    } = req.body;

    // Parse values (since multipart form sends strings)
    const parsedQuestionTypes = typeof questionTypes === 'string' 
      ? JSON.parse(questionTypes) 
      : questionTypes;
      
    const parsedDiffDist = typeof difficultyDistribution === 'string'
      ? JSON.parse(difficultyDistribution)
      : difficultyDistribution;

    const file = req.file;
    let uploadedFilePath = '';
    let referenceContent = '';

    if (file) {
      uploadedFilePath = file.path;
      try {
        referenceContent = await extractFileText(file.path);
        console.log(`Successfully extracted ${referenceContent.length} chars of reference text.`);
      } catch (err) {
        console.error('File text extraction failed:', err);
      }
    }

    // Validation
    if (!subject || !grade || !topic || !dueDate || !parsedQuestionTypes || !numQuestions || !marksPerQuestion || !parsedDiffDist) {
      res.status(400).json({ error: 'Missing required assignment fields' });
      return;
    }

    const assignment = await db.createAssignment({
      subject,
      grade,
      topic,
      dueDate,
      questionTypes: parsedQuestionTypes,
      numQuestions: Number(numQuestions),
      marksPerQuestion: Number(marksPerQuestion),
      difficultyDistribution: parsedDiffDist,
      additionalInstructions: additionalInstructions || '',
      uploadedFilePath
    });

    const assignmentId = assignment.id || assignment._id;
    if (!assignmentId) {
      res.status(500).json({ error: 'Failed to create assignment record' });
      return;
    }

    // Trigger async job
    const jobId = await addAssignmentJob(assignmentId);

    // Save extracted reference content in global or session scope if needed,
    // or we can read it directly from the file in the worker/job processor.
    // In our simplified setup, the processor reads it from db/file.

    res.status(201).json({ jobId, assignmentId });
  } catch (error: any) {
    console.error('Create assignment route error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

/**
 * GET /api/assignments
 * Returns a list of all assignments (newest first)
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const assignments = await db.listAssignments();
    res.json(assignments);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

/**
 * GET /api/assignments/:id
 * Returns assignment details with its generated paper (if complete)
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const assignment = await db.getAssignment(req.params.id);
    if (!assignment) {
      res.status(404).json({ error: 'Assignment not found' });
      return;
    }
    res.json(assignment);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

/**
 * POST /api/assignments/:id/regenerate
 * Triggers a new generation job for an existing assignment
 */
router.post('/:id/regenerate', async (req: Request, res: Response) => {
  try {
    const assignmentId = req.params.id;
    const assignment = await db.getAssignment(assignmentId);
    if (!assignment) {
      res.status(404).json({ error: 'Assignment not found' });
      return;
    }

    const jobId = await addAssignmentJob(assignmentId);
    res.json({ jobId, assignmentId });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

/**
 * POST /api/assignments/:id/export-pdf
 * Triggers Puppeteer PDF generation
 */
router.post('/:id/export-pdf', async (req: Request, res: Response) => {
  try {
    const assignmentId = req.params.id;
    const assignment = await db.getAssignment(assignmentId);
    if (!assignment || !assignment.generatedPaper) {
      res.status(404).json({ error: 'Assignment generated paper not found' });
      return;
    }

    const pdfBuffer = await generatePDF(assignmentId, assignment);
    const filename = `${assignment.subject.replace(/\s+/g, '_')}-${assignment.topic.replace(/\s+/g, '_')}-paper.pdf`;
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(pdfBuffer);
  } catch (error: any) {
    console.error('PDF export route error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

export default router;
