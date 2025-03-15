const mongoose = require('mongoose');

const responseSchema = mongoose.Schema({
  questionId: String,
  questionText: String,
  answerText: String,
  responseDate: {
    type: Date,
    default: Date.now,
  },
});

const questionResponseSchema = mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Project',
    },
    responses: [responseSchema],
  },
  {
    timestamps: true,
  }
);

const QuestionResponse = mongoose.model('QuestionResponse', questionResponseSchema);

module.exports = QuestionResponse;