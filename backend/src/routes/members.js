const express    = require('express')
const router     = express.Router()
const {
  getAllMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember,
  getMemberHistory,
} = require('../controllers/membersController')
const { protect } = require('../middleware/authMiddleware')

router.get('/',            protect, getAllMembers)
router.get('/:id',         protect, getMemberById)
router.get('/:id/history', protect, getMemberHistory)
router.post('/',           protect, createMember)
router.put('/:id',         protect, updateMember)
router.delete('/:id',      protect, deleteMember)

module.exports = router