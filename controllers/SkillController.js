// skillController.js

const Skill = require('../models/SkillModel')

// Retrieve all skills
const getAllSkills = async (req, res) => {
  try {
    const skills = await Skill.find()
    res.json(skills)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

// Retrieve a specific skill by ID
const getSkillById = async (req, res) => {
  const skillId = req.params.id
  try {
    const skill = await Skill.findById(skillId)
    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' })
    }
    res.json(skill)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

// Create a new skill
const createSkill = async (req, res) => {
  const { name, category, experienceLevel } = req.body
  const newSkill = new Skill({
    name,
    category,
    experienceLevel,
  })

  try {
    const savedSkill = await newSkill.save()
    res.status(201).json(savedSkill)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

// Update a skill by ID
const updateSkill = async (req, res) => {
  const skillId = req.params.id
  const { name, category, experienceLevel } = req.body

  try {
    const updatedSkill = await Skill.findByIdAndUpdate(
      skillId,
      {
        name,
        category,
        experienceLevel,
      },
      { new: true }
    )

    if (!updatedSkill) {
      return res.status(404).json({ error: 'Skill not found' })
    }

    res.json(updatedSkill)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

// Delete a skill by ID
const deleteSkill = async (req, res) => {
  const skillId = req.params.id

  try {
    const deletedSkill = await Skill.findByIdAndDelete(skillId)

    if (!deletedSkill) {
      return res.status(404).json({ error: 'Skill not found' })
    }

    res.json(deletedSkill)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

// Export all controller methods as an object
module.exports = {
  getAllSkills,
  getSkillById,
  createSkill,
  updateSkill,
  deleteSkill,
}
