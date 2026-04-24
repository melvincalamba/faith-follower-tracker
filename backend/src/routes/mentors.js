const express    = require('express')
const router     = express.Router()
const { getAllMentors, getMentorMembers } = require('../controllers/mentorsController')
const { protect } = require('../middleware/authMiddleware')

router.get('/',           protect, getAllMentors)
router.get('/:id/members',protect, getMentorMembers)

module.exports = router