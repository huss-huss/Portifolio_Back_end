require('dotenv').config()
const express = require('express')
const cookieParser = require('cookie-parser')
const app = express()
const PORT = process.env.PORT || 3000

// Import routes
const skillRoutes = require('./routes/SkillRoute')
const projectRoutes = require('./routes/ProjectRoute')
const blogPostRoutes = require('./routes/BlogPostRoute')
const authRoutes = require('./routes/authRoutes')

// Import middleware
const { notFound, errorHandler } = require('./middlewares/errorHandler')

// Import database connection
const connectDB = require('./config/dbConnection')

// Connect to database
connectDB()

// Parse JSON bodies (as sent by API clients)
app.use(express.json())
app.use(cookieParser())

// Mount routes
app.use('/api/user', authRoutes)
app.use('/api/skill', skillRoutes)
app.use('/api/project', projectRoutes)
app.use('/api/blog-post', blogPostRoutes)

// Mount middleware
app.use(notFound)
app.use(errorHandler)

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))
