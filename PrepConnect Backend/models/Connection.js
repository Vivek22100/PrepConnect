import mongoose from 'mongoose';
const { Schema } = mongoose;

const connectionSchema = new Schema({
  fromUser: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  toUser: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
    required: true
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Connection', connectionSchema); 