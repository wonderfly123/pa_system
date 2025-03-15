// backend/routes/projectRoutes.js
const express = require('express');
const router = express.Router();
const { 
  getProjects, 
  getProject, 
  getUserProjects, 
  createProject, 
  updateProject, 
  deleteProject
} = require('../controllers/projectController');

// If you have auth middleware
// const { protect } = require('../middleware/authMiddleware');

// Routes
router.route('/')
  .get(getProjects)
  .post(createProject);

router.route('/user/:userId')
  .get(getUserProjects);

router.route('/:id')
  .get(getProject)
  .put(updateProject)
  .delete(deleteProject);

module.exports = router;