// blogRoutes.js

const express = require('express')
const {
  getAllBlogPosts,
  getBlogPostById,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
} = require('../controllers/BlogPostController')
const { authMiddleware } = require('../middlewares/authMiddlewares')
const router = express.Router()

// Define routes for blog-related endpoints
router.get('/blog-posts', getAllBlogPosts)
router.get('/blog-posts/:id', getBlogPostById)
router.post('/blog-posts', authMiddleware, createBlogPost)
router.put('/blog-posts/:id', authMiddleware, updateBlogPost)
router.delete('/blog-posts/:id', authMiddleware, deleteBlogPost)

module.exports = router
