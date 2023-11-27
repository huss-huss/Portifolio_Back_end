const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost/portfolio', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    })

    console.log('MongoDB connected')
  } catch (error) {
    console.error('MongoDB connection error:', error)
    process.exit(1) // Exit process with failure
  }
}

module.exports = connectDB
