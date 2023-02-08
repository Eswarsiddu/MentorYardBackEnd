const { Router } = require('express')
const {
  getMentorByMenteeId,
  getMentorById,
  addMentorByMenteeId,
  updateMentorById,
  deleteMentorById,
  getAllMentors
} = require('../Routes/Controllers/mentorController');

const mentorRouter = Router()

mentorRouter.post("/:menteeId", addMentorByMenteeId);


mentorRouter.get('/', getAllMentors)
mentorRouter.get('/:mentorId', getMentorById)
mentorRouter.get("/:menteeId", getMentorByMenteeId);


mentorRouter.put('/:mentorId', updateMentorById)
mentorRouter.delete('/:mentorId', deleteMentorById)


module.exports = mentorRouter