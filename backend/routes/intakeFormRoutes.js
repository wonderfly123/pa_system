// backend/routes/intakeFormRoutes.js
const express = require('express');
const router = express.Router();
const {
  createIntakeForm,
  getIntakeFormsByUser,
  getIntakeFormById,
  updateIntakeForm,
  generateFemaForms,
  validatePappgCompliance
} = require('../controllers/intakeFormController');

router.route('/').post(createIntakeForm);
router.route('/user/:userId').get(getIntakeFormsByUser);
router.route('/:id').get(getIntakeFormById).put(updateIntakeForm);
router.route('/:id/generate').post(generateFemaForms);
router.route('/:id/validate').post(validatePappgCompliance);

module.exports = router;