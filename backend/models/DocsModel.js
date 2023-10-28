import mongoose from 'mongoose';
const {Schema} = mongoose;

const DocsSchema = new Schema({
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
    tags: [{
        type: String,
        default: [],
    }],
    description: {
        type: String,
    },
    assetURL: {
        type: String,
    },
    assetPublicId: {
        type: String,
    },
})

const Application = new mongoose.model('Application', DocsSchema);

export default Application