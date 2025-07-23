import mongoose from 'mongoose';
const { Schema } = mongoose;

const mockInterviewSchema = new Schema({
  seniorRef: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  juniorRef: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  scheduledAt: { type: Date, required: true },
  feedback: { type: String },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending'
  }
});

export default mongoose.model('MockInterview', mockInterviewSchema); 