import mongoose from 'mongoose';
const { Schema } = mongoose;

const commentSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const experienceSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  tags: [{ type: String }],
  company: { type: String },
  position: { type: String },
  batch: { type: String },
  level: { type: String },
  interviewProcess: { type: String },
  keyLearnings: { type: String },
  advice: { type: String },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  upvotes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  downvotes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  comments: [commentSchema]
}, {
  timestamps: true
});

export default mongoose.model('Experience', experienceSchema); 