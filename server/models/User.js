import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  walletAddress: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  profilePic: { type: String, required: true },
});

export default mongoose.model('User', UserSchema);
