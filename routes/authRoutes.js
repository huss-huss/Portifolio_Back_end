const express = require('express')
const {
  createUser,
  loginUser,
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
  loginAdmin,
} = require('../controllers/UserController')
const { authMiddleware, isAdmin } = require('../middlewares/authMiddlewares')
const router = express.Router()

router.post('/register', createUser)
router.post('/login', loginUser)
router.post('/admin-login', loginAdmin)
router.post('/forgot-password', forgotPassword)

router.get('/all-users', getAllUsers)
router.get('/refresh', handleRefreshToken)
router.get('/logout', logoutUser)
router.get('/:id', authMiddleware, isAdmin, getUserById)

router.put('/reset-password/:token', resetPassword)
router.put('/update-password', authMiddleware, updatePassword)
router.put('/edit-user', authMiddleware, updateUserById)
router.put('/block-user/:id', authMiddleware, isAdmin, blockUserById)
router.put('/unblock-user/:id', authMiddleware, isAdmin, unblockUserById)
router.delete('/:id', deleteUserById)

module.exports = router
