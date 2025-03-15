const mongoose = require('mongoose');

const projectSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    disasterId: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: 'New',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    metrics: {
      totalDocuments: {
        type: Number,
        default: 0,
      },
      processedDocuments: {
        type: Number,
        default: 0,
      },
      completedForms: {
        type: Number,
        default: 0,
      },
      pendingForms: {
        type: Number,
        default: 0,
      },
      completionPercentage: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;