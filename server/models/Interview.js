import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, default: '' },
  evaluation: {
    score: { type: Number, default: 0 },
    communication: { type: Number, default: 0 },
    technicalAccuracy: { type: Number, default: 0 },
    confidence: { type: Number, default: 0 },
    problemSolving: { type: Number, default: 0 },
    completeness: { type: Number, default: 0 },
    strengths: [String],
    weaknesses: [String],
    improvements: [String],
    feedback: { type: String, default: '' },
  },
});

const interviewSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['HR', 'Technical', 'Mixed'], default: 'Technical' },
    domain: { type: String, required: true },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
    mode: { type: String, enum: ['Text', 'Voice'], default: 'Text' },
    questionCount: { type: Number, default: 5 },
    questions: [questionSchema],
    score: { type: Number, default: 0 },
    duration: { type: Number, default: 0 },
    status: { type: String, enum: ['in-progress', 'completed'], default: 'in-progress' },
    startedAt: { type: Date, default: Date.now },
    completedAt: Date,
  },
  { timestamps: true }
);

const Interview = mongoose.model('Interview', interviewSchema);
export default Interview;
