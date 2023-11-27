// projectController.js

const Project = require('../models/ProjectModel')

// Retrieve all projects
const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find()
    res.json(projects)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

// Retrieve a specific project by ID
const getProjectById = async (req, res) => {
  const projectId = req.params.id
  try {
    const project = await Project.findById(projectId)
    if (!project) {
      return res.status(404).json({ error: 'Project not found' })
    }
    res.json(project)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

// Create a new project
const createProject = async (req, res) => {
  const { title, description, technologies, image, githubLink, liveDemoLink } =
    req.body
  const newProject = new Project({
    title,
    description,
    technologies,
    image,
    githubLink,
    liveDemoLink,
  })

  try {
    const savedProject = await newProject.save()
    res.status(201).json(savedProject)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

// Update a project by ID
const updateProject = async (req, res) => {
  const projectId = req.params.id
  const { title, description, technologies, image, githubLink, liveDemoLink } =
    req.body

  try {
    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      {
        title,
        description,
        technologies,
        image,
        githubLink,
        liveDemoLink,
      },
      { new: true }
    )

    if (!updatedProject) {
      return res.status(404).json({ error: 'Project not found' })
    }

    res.json(updatedProject)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

// Delete a project by ID
const deleteProject = async (req, res) => {
  const projectId = req.params.id

  try {
    const deletedProject = await Project.findByIdAndDelete(projectId)

    if (!deletedProject) {
      return res.status(404).json({ error: 'Project not found' })
    }

    res.json(deletedProject)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

// Export all controller methods as an object
module.exports = {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
}
