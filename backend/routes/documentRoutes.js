const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
  getDocumentsByProject,
  uploadDocument,
  deleteDocument,
} = require('../controllers/documentController');

// Configure storage
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}_${path.basename(file.originalname)}`);
  },
});

// Check file type
const checkFileType = (file, cb) => {
  const filetypes = /pdf|doc|docx|xls|xlsx|jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  
  if (extname) {
    return cb(null, true);
  } else {
    cb('Error: Invalid file type!');
  }
};

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

router.route('/project/:projectId').get(getDocumentsByProject);
router.route('/upload').post(upload.single('file'), uploadDocument);
router.route('/:id').delete(deleteDocument);

module.exports = router;