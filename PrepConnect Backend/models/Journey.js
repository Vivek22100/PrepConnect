import mongoose from 'mongoose';
const { Schema } = mongoose;

const timelineStepSchema = new Schema({
  date: { type: Date, required: true },
  title: { type: String, required: true },
  description: { type: String },
  icon: { type: String },
  category: { type: String }
});

const journeySchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  company: { type: String, required: true },
  role: { type: String, required: true },
  timeline: [timelineStepSchema],
  totalDays: { type: Number },
  successRate: { type: Number }
}, {
  timestamps: true
});

export default mongoose.model('Journey', journeySchema); 