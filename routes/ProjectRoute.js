// projectRoutes.js

const express = require('express')
const {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} = require('../controllers/ProjectController')
const router = express.Router()

// Define routes for project-related endpoints
router.get('/projects', getAllProjects)
router.get('/projects/:id', getProjectById)
router.post('/projects', createProject)
router.put('/projects/:id', updateProject)
router.delete('/projects/:id', deleteProject)

module.exports = router
