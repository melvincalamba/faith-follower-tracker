const express    = require('express')
const router     = express.Router()
const {
  getAllMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember,
} = require('../controllers/membersController')
const { protect, adminOnly } = require('../middleware/authMiddleware')

// Lahat ng members routes ay protected na
router.get('/',       protect,              getAllMembers)
router.get('/:id',    protect,              getMemberById)
router.post('/',      protect,              createMember)
router.put('/:id',    protect,              updateMember)
router.delete('/:id', protect, adminOnly,   deleteMember)  // Admin only ang delete

module.exports = router