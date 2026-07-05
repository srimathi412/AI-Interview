import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    college: { type: String, default: '' },
    department: { type: String, default: '' },
    skills: [{ type: String }],
    resumeUrl: { type: String, default: '' },
    resumeData: {
      skills: [String],
      projects: [String],
      education: [String],
      experience: [String],
      technologies: [String],
    },
    resumeScore: { type: Number, default: 0 },
    missingSkills: [{ type: String }],
    resumeSuggestions: [{ type: String }],
    readinessScore: { type: Number, default: 0 },
    role: { type: String, enum: ['candidate', 'admin'], default: 'candidate' },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    lastActive: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.resetPasswordToken;
  delete obj.resetPasswordExpire;
  return obj;
};

const User = mongoose.model('User', userSchema);
export default User;
