// backend/routes/intakeFormRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const {
  createIntakeForm,
  getIntakeFormsByUser,
  getIntakeFormById,
  updateIntakeForm,
  generateFemaForms,
  validatePappgCompliance,
  processPDADocument,
  validateWithAI,
  getFormSuggestions,
  validateCosts
} = require('../controllers/intakeFormController');

// Basic form routes
router.route('/').post(createIntakeForm);
router.route('/user/:userId').get(getIntakeFormsByUser);
router.route('/:id').get(getIntakeFormById).put(updateIntakeForm);
router.route('/:id/generate').post(generateFemaForms);
router.route('/:id/validate').post(validatePappgCompliance);

// New AI integration routes
router.route('/process-pda').post(upload.single('file'), processPDADocument);
router.route('/validate-ai').post(validateWithAI);
router.route('/suggestions').post(getFormSuggestions);
router.route('/validate-costs').post(validateCosts);

module.exports = router;