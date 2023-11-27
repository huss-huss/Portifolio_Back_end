// skillRoutes.js

const express = require('express')
const {
  getAllSkills,
  getSkillById,
  createSkill,
  updateSkill,
  deleteSkill,
} = require('../controllers/SkillController')
const router = express.Router()

// Define routes for skill-related endpoints
router.get('/skills', getAllSkills)
router.get('/skills/:id', getSkillById)
router.post('/skills', createSkill)
router.put('/skills/:id', updateSkill)
router.delete('/skills/:id', deleteSkill)

module.exports = router
