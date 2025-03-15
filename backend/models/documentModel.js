const mongoose = require('mongoose');

const documentSchema = mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Project',
    },
    documentType: {
      type: String,
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: 'Uploaded',
    },
    extractedData: {
      type: Map,
      of: String,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

const Document = mongoose.model('Document', documentSchema);

module.exports = Document;