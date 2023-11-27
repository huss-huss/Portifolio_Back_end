const User = require('../models/UserModel')

const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const uniqid = require('uniqid')

const validateMongodbId = require('../utils/validateMongodbId')

const { generateAccessToken } = require('../config/jwtAccessToken')
const { generateRefreshToken } = require('../config/jwtRefreshToken')
const sendEmail = require('./emailController')

const createUser = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, email, mobile, password } = req.body

  const findUser = await User.findOne({ email })

  if (findUser) {
    throw new Error('User already exists')
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    mobile,
    password,
  })

  user.save()

  res.status(201).json({ msg: 'User created successfully', user })
})

// Login User
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  //console.log(email, password)
  // Check if user exists

  const findUser = await User.findOne({ email })
  //console.log(findUser)
  if (findUser && (await findUser.isPasswordMatched(password))) {
    const refreshToken = await generateRefreshToken(findUser?._id)
    const updateUser = await User.findByIdAndUpdate(
      findUser?._id,
      {
        refreshToken: refreshToken,
      },
      {
        new: true,
      }
    )
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000,
    })
    res.status(200).json({
      _id: findUser?._id,
      firstName: findUser?.firstName,
      lastName: findUser?.lastName,
      email: findUser?.email,
      mobile: findUser?.mobile,
      role: findUser?.role,
      token: generateAccessToken(findUser?._id),
    })
  } else {
    throw new Error('Invalid email or password')
  }
})

// Login admin

const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  //console.log(email, password)
  // Check if user exists

  const findAdmin = await User.findOne({ email })
  //console.log(findAdmin)
  if (findAdmin.role !== 'admin') throw new Error('Not Authorized')
  if (findAdmin && (await findAdmin.isPasswordMatched(password))) {
    const refreshToken = await generateRefreshToken(findAdmin?._id)
    const updateUser = await User.findByIdAndUpdate(
      findAdmin?._id,
      {
        refreshToken: refreshToken,
      },
      {
        new: true,
      }
    )
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000,
    })
    res.status(200).json({
      _id: findAdmin?._id,
      firstName: findAdmin?.firstName,
      lastName: findAdmin?.lastName,
      email: findAdmin?.email,
      mobile: findAdmin?.mobile,
      role: findAdmin?.role,
      token: generateAccessToken(findAdmin?._id),
    })
  } else {
    throw new Error('Invalid email or password')
  }
})

// update a user by id

const updateUserById = asyncHandler(async (req, res) => {
  try {
    const { _id } = req.user
    validateMongodbId(_id)
    const { firstName, lastName, email, mobile } = req.body
    const user = await User.findByIdAndUpdate(
      _id,
      {
        firstName,
        lastName,
        email,
        mobile,
      },
      {
        new: true,
      }
    )
    res.json(user)
  } catch (error) {
    throw new Error(error)
  }
})

// Get all users
const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find({})
    res.json(users)
  } catch (error) {
    throw new Error(error)
  }
})

// Get a user by id
const getUserById = asyncHandler(async (req, res) => {
  //console.log(req.params.id)
  try {
    const { id } = req.params
    validateMongodbId(id)
    const user = await User.findById({ _id: id })
    res.json(user)
  } catch (error) {
    throw new Error(error)
  }
})

// delete a user by id

const deleteUserById = asyncHandler(async (req, res) => {
  const { id } = req.params
  validateMongodbId(id)
  const user = await User.findByIdAndDelete({ _id: id })
  if (user) {
    res.json(user)
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// block a user by id
const blockUserById = asyncHandler(async (req, res) => {
  const { id } = req.params
  validateMongodbId(id)
  try {
    const blockUser = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      {
        new: true,
      }
    )
    res.json(blockUser)
  } catch (error) {
    throw new Error(error)
  }
})

// unblock a user by id
const unblockUserById = asyncHandler(async (req, res) => {
  const { id } = req.params
  validateMongodbId(id)
  try {
    const unblockUser = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      },
      {
        new: true,
      }
    )
    res.json(unblockUser)
  } catch (error) {
    throw new Error(error)
  }
})

// Handle Refresh Token
const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies
  //console.log(cookie)
  if (!cookie?.refreshToken) {
    throw new Error('No Refresh Token in cookie')
  }
  const { refreshToken } = cookie
  //console.log(refreshToken)
  const findUser = await User.findOne({ refreshToken })
  //console.log(findUser)
  if (!findUser) throw new Error('No Refresh Token in database or not matched')
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    //console.log(user)
    if (err || findUser._id.toString() !== user.id) {
      throw new Error(
        'Invalid Refresh Token or There is Something Wrong with the Refresh Token'
      )
    }
    const accessToken = generateAccessToken(user.id)
    res.json({ accessToken })
  })
})

const logoutUser = asyncHandler(async (req, res) => {
  const cookie = req.cookies
  if (!cookie?.refreshToken) {
    throw new Error('No Refresh Token in cookie')
  }
  const { refreshToken } = cookie
  const findUser = await User.findOne({ refreshToken })

  if (!findUser) {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
    })
    return res.status(204).json({ msg: 'User logged out successfully' })
  }
  await User.findOneAndUpdate(
    { refreshToken },
    {
      refreshToken: ' ',
    }
  )
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: true,
  })
  res.status(204).json({ msg: 'User logged out successfully' })
})

const updatePassword = asyncHandler(async (req, res) => {
  const { _id } = req.user
  validateMongodbId(_id)
  const { oldPassword, newPassword } = req.body
  const user = await User.findById(_id)
  if (user && (await user.isPasswordMatched(oldPassword))) {
    user.password = newPassword
    const updatedPassword = await user.save()
    res.json(updatedPassword)
  } else {
    throw new Error('Invalid Old Password or User not found')
  }
})

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body

  const user = await User.findOne({ email })
  if (!user) {
    throw new Error('User not found')
  }
  try {
    const token = await user.createPasswordResetToken()
    await user.save()
    const resetURL = `Hi ${user.firstName} ${user.lastName},<br><br>Please click on the link below to reset your password:<br><br>${process.env.CLIENT_URL}/reset-password/${token}<br><br>If you did not request this, please ignore this email and your password will remain unchanged.<br><br>Thanks,<br>Team ${process.env.APP_NAME}`
    const data = {
      to: email,
      subject: `Password Reset Link for ${process.env.APP_NAME}`,
      text: resetURL,
      html: `<p>${resetURL}</p>`,
    }
    await sendEmail(data)
    res.json(token)
  } catch (error) {
    throw new Error(error)
  }
})

const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params
  const { password } = req.body
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex')

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  })
  if (!user) {
    throw new Error('Token is invalid or has expired')
  }
  user.password = password
  user.passwordResetToken = undefined
  user.passwordResetExpires = undefined
  await user.save()
  res.json(user)
})

module.exports = {
  createUser,
  loginUser,
  loginAdmin,
  getAllUsers,
  getUserById,
  deleteUserById,
  updateUserById,
  blockUserById,
  unblockUserById,
  handleRefreshToken,
  logoutUser,
  updatePassword,
  forgotPassword,
  resetPassword,
}
