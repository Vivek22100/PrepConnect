import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['junior', 'senior', 'mentor'], default: 'junior' },
  domain: { type: String }, // e.g., 'Frontend', 'Backend', 'Data Science'
  industryExperience: { type: Number, default: 0 }, // years of experience
  mentoredStudents: { type: Number, default: 0 }
}, {
  timestamps: true
});

export default mongoose.model('User', userSchema); 