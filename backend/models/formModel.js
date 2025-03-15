const mongoose = require('mongoose');

const validationIssueSchema = mongoose.Schema({
  fieldName: String,
  issue: String,
  suggestion: String,
});

const formSchema = mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Project',
    },
    formType: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: 'Draft',
    },
    formData: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    validationIssues: [validationIssueSchema],
  },
  {
    timestamps: true,
  }
);

const Form = mongoose.model('Form', formSchema);

module.exports = Form;