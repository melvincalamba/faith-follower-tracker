const express    = require('express')
const router     = express.Router()
const { getAllUsers, approveUser, deleteUser } = require('../controllers/usersController')
const { protect, adminOnly } = require('../middleware/authMiddleware')

// Admin only ang lahat ng routes dito
router.get('/',              protect, adminOnly, getAllUsers)
router.patch('/:id/approve', protect, adminOnly, approveUser)
router.delete('/:id',        protect, adminOnly, deleteUser)

module.exports = router