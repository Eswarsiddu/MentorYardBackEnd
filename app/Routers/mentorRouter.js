const { Router } = require("express");
const {
  getMentorsByMenteeId,
  getMentorById,
  addMentor,
  reActivateMentorById,
  deActivateMentorById,
  updateMentorById,
  deleteMentorById,
  getAllMentors,
  getActiveMentors,
  getDeactivatedMentors,
  connectMentorAndMentee,
} = require("../Routes/Controllers/mentorController");

const mentorRouter = Router();

mentorRouter.post("/", addMentor);

mentorRouter.put("/deactivate/:mentorId", deActivateMentorById);
mentorRouter.put("/reactivate/:mentorId", reActivateMentorById);


mentorRouter.put("/connect", connectMentorAndMentee);




mentorRouter.get("/", getAllMentors);
mentorRouter.get("/active", getActiveMentors);
mentorRouter.get("/inactive", getDeactivatedMentors);


mentorRouter.get("/:mentorId", getMentorById);
mentorRouter.get("/my-mentors/:menteeId", getMentorsByMenteeId);

mentorRouter.put("/:mentorId", updateMentorById);
mentorRouter.delete("/:mentorId", deleteMentorById);

module.exports = mentorRouter;
