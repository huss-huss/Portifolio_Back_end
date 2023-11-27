// blogController.js

const BlogPost = require('../models/BlogPostModel')

// Retrieve all blog posts
const getAllBlogPosts = async (req, res) => {
  try {
    const blogPosts = await BlogPost.find()
    res.json(blogPosts)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

// Retrieve a specific blog post by ID
const getBlogPostById = async (req, res) => {
  const blogPostId = req.params.id
  try {
    const blogPost = await BlogPost.findById(blogPostId)
    if (!blogPost) {
      return res.status(404).json({ error: 'Blog post not found' })
    }
    res.json(blogPost)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

// Create a new blog post
const createBlogPost = async (req, res) => {
  const { title, content, author, tags } = req.body
  const newBlogPost = new BlogPost({
    title,
    content,
    author,
    tags,
  })

  try {
    const savedBlogPost = await newBlogPost.save()
    res.status(201).json(savedBlogPost)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

// Update a blog post by ID
const updateBlogPost = async (req, res) => {
  const blogPostId = req.params.id
  const { title, content, author, tags } = req.body

  try {
    const updatedBlogPost = await BlogPost.findByIdAndUpdate(
      blogPostId,
      {
        title,
        content,
        author,
        tags,
      },
      { new: true }
    )

    if (!updatedBlogPost) {
      return res.status(404).json({ error: 'Blog post not found' })
    }

    res.json(updatedBlogPost)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

// Delete a blog post by ID
const deleteBlogPost = async (req, res) => {
  const blogPostId = req.params.id

  try {
    const deletedBlogPost = await BlogPost.findByIdAndDelete(blogPostId)

    if (!deletedBlogPost) {
      return res.status(404).json({ error: 'Blog post not found' })
    }

    res.json(deletedBlogPost)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

// Export all controller methods as an object
module.exports = {
  getAllBlogPosts,
  getBlogPostById,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
}
