import mongoose from 'mongoose';
const { Schema } = mongoose;

const questionSchema = new Schema({
  question: { type: String, required: true },
  tags: [{ type: String }],
  company: { type: String },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, {
  timestamps: true
});

export default mongoose.model('Question', questionSchema); 