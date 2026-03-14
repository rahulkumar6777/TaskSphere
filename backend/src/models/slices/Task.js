import mongoose from "mongoose";

const VALID_STATUSES = ['todo', 'in-progress', 'completed', 'cancelled'];
const VALID_PRIORITIES = ['low', 'medium', 'high'];

const taskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
      default: '',
    },
    status: {
      type: String,
      enum: {
        values: VALID_STATUSES,
        message: '{VALUE} is not a valid status'
      },
      default: 'todo',
    },
    priority: {
      type: String,
      enum: {
        values: VALID_PRIORITIES,
        message: '{VALUE} is not a valid priority'
      },
      default: 'medium',
    },
    dueDate: {
      type: Date,
      default: null,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);


taskSchema.index({ user: 1, status: 1, createdAt: -1 });
taskSchema.index({ user: 1, title: 'text', description: 'text' });


export const Task = mongoose.model('Task', taskSchema)
