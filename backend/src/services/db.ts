import mongoose from 'mongoose';
import { Assignment } from 'shared';
import { AssignmentModel } from '../models/Assignment';

let isMongoConnected = false;
const inMemoryStore: Map<string, Assignment> = new Map();

export async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/vedaai';
  try {
    console.log('Attempting to connect to MongoDB at:', uri);
    mongoose.set('strictQuery', false);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    isMongoConnected = true;
    console.log('MongoDB Connected successfully!');
  } catch (error: any) {
    console.warn('⚠️ MongoDB connection failed. Falling back to IN-MEMORY DATABASE.');
    console.warn(`Reason: ${error.message}`);
    isMongoConnected = false;
  }
}

export const db = {
  async createAssignment(data: Omit<Assignment, 'status'>): Promise<Assignment> {
    if (isMongoConnected) {
      try {
        const doc = await AssignmentModel.create({
          ...data,
          status: 'pending',
        });
        const obj = doc.toObject();
        return { ...obj, id: obj._id.toString() } as Assignment;
      } catch (err) {
        console.error('Mongoose create error, using memory fallback:', err);
      }
    }
    
    // In-memory fallback
    const id = 'mem_' + Math.random().toString(36).substring(2, 11);
    const newAssignment: Assignment = {
      ...data,
      id,
      _id: id,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    inMemoryStore.set(id, newAssignment);
    return newAssignment;
  },

  async getAssignment(id: string): Promise<Assignment | null> {
    if (isMongoConnected) {
      try {
        const doc = await AssignmentModel.findById(id);
        if (doc) {
          const obj = doc.toObject();
          return { ...obj, id: obj._id.toString() } as Assignment;
        }
      } catch (err) {
        console.error('Mongoose find error, trying memory fallback:', err);
      }
    }
    return inMemoryStore.get(id) || null;
  },

  async updateAssignment(id: string, updates: Partial<Assignment>): Promise<Assignment | null> {
    if (isMongoConnected) {
      try {
        const doc = await AssignmentModel.findByIdAndUpdate(id, updates, { new: true });
        if (doc) {
          const obj = doc.toObject();
          return { ...obj, id: obj._id.toString() } as Assignment;
        }
      } catch (err) {
        console.error('Mongoose update error, trying memory fallback:', err);
      }
    }

    const item = inMemoryStore.get(id);
    if (!item) return null;

    const updated = {
      ...item,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    inMemoryStore.set(id, updated);
    return updated;
  },

  async listAssignments(): Promise<Assignment[]> {
    if (isMongoConnected) {
      try {
        const docs = await AssignmentModel.find().sort({ createdAt: -1 });
        return docs.map(d => {
          const obj = d.toObject();
          return { ...obj, id: obj._id.toString() } as Assignment;
        });
      } catch (err) {
        console.error('Mongoose find all error, trying memory fallback:', err);
      }
    }
    return Array.from(inMemoryStore.values()).sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  }
};
