import mongoose from 'mongoose';
const { Schema } = mongoose;

const brandSchema = new Schema({
  brandName: {
    type: String,
    required: true,
  },
  Image: [{
    type: mongoose.Schema.Types.ObjectId, // this is how we reference to another mongoose model
    ref: 'Image'
  }],
  Video: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video'
  }],
  Music: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Music'
  }],
  Application: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application'
  }]
});

const BrandModel = mongoose.model('BrandModel', brandSchema);

export default BrandModel;