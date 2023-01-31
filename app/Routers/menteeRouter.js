const { Router } = require('express')
const menteeRouter = Router()
const { uploadImageTos3 } = require('../Services/uploadToS3')
const {
  getAllMentees,
  getMenteeById,
  addMentee,
  updateMenteeById,
  deleteMenteeById
} = require('../Routes/Controllers/menteeController');


// MenteeRouter.use(authMiddleware)

// general routes
menteeRouter.get('/', getAllMentees)
menteeRouter.get('/:menteeId', getMenteeById)

// verified Routes
menteeRouter.post('/', uploadImageTos3.single('file'), addMentee)
menteeRouter.put('/:menteeId', updateMenteeById)
menteeRouter.delete('/:menteeId', deleteMenteeById)

module.exports = MenteeRouter