import mongoose from 'mongoose';
const { Schema } = mongoose;

const assetSchema = new Schema({
  brand: {
    type: String,
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  fileType: {
    type: String,
    required: true,
  },
  fileSize: {
    type: Number,
    required: true,
  },
  uploadTimestamp: {
    type: Date,
    required: true,
    default: Date.now,
  },
  storageLocation: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
    default: [],
  },
  category: {
    type: String,
  },
  description: {
    type: String,
  },
  assetPublicId: {
    type: String,
  },
  assetURL: {
    type: String,
  }
});

const Asset = mongoose.model('Asset', assetSchema);

export default Asset;