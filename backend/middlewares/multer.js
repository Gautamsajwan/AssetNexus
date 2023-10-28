import multer from 'multer';

// set up storage for uploaded files locally;-
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// set up storage for uploading files to the server
// const storage = multer.memoryStorage()

const upload = multer({storage,
  limits: {
    fileSize: 20 * 1024 * 1024, // 10 MB (adjust as needed)
},});

export default upload;