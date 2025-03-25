// backend/routes/projectRoutes.js
const express = require('express');
const router = express.Router();
const { 
  getProjects, 
  getProjectById,
  getProjectsByUser,
  createProject, 
  updateProject, 
  deleteProject
} = require('../controllers/projectController');

// Routes
router.route('/')
  .get(getProjects)
  .post(createProject);

router.route('/user/:userId')
  .get(getProjectsByUser);

router.route('/:id')
  .get(getProjectById)
  .put(updateProject)
  .delete(deleteProject);

module.exports = router;