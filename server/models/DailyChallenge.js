import mongoose from 'mongoose';

const dailyChallengeSchema = new mongoose.Schema(
  {
    date: { type: String, required: true, unique: true },
    question: { type: String, required: true },
    hint: { type: String, default: '' },
    solution: { type: String, default: '' },
    domain: { type: String, default: 'General' },
    difficulty: { type: String, default: 'Medium' },
  },
  { timestamps: true }
);

const DailyChallenge = mongoose.model('DailyChallenge', dailyChallengeSchema);
export default DailyChallenge;
