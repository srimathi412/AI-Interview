import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    interviewId: { type: mongoose.Schema.Types.ObjectId, ref: 'Interview', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    overallScore: { type: Number, default: 0 },
    performanceSummary: { type: String, default: '' },
    strengths: [{ type: String }],
    weaknesses: [{ type: String }],
    suggestions: [{ type: String }],
    recommendedTopics: [{ type: String }],
    learningPath: [{ type: String }],
    questionFeedback: [
      {
        question: String,
        answer: String,
        score: Number,
        feedback: String,
      },
    ],
  },
  { timestamps: true }
);

const Report = mongoose.model('Report', reportSchema);
export default Report;
