const { Router } = require('express')
const {
  getMentorByMenteeId,
  getMentorById,
  addMentorByMenteeId,
  updateMentorById,
  deleteMentorById,
  getAllMentor
} = require('../Routes/Controllers/mentorController');

const mentorRouter = Router()

mentorRouter.get('/', getAllMentor)
mentorRouter.get('/mentor/:mentorId', getMentorById)

mentorRouter.put('/:mentorId', updateMentorById)
mentorRouter.delete('/:mentorId', deleteMentorById)

mentorRouter.get('/:menteeId', getMentorByMenteeId)
mentorRouter.post('/:menteeId', addMentorByMenteeId)

module.exports = mentorRouter