// skillModel.js

const mongoose = require('mongoose')

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    experienceLevel: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Intermediate',
    },
  },
  {
    timestamps: true,
  }
)

const Skill = mongoose.model('Skill', skillSchema)

module.exports = Skill
