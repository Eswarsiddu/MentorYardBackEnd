const { Router } = require("express");
const {
  getFilteredMentors,
  getMentorsByMenteeId,
  getMentorById,
  addMentor,
  reActivateMentorById,
  deActivateMentorById,
  updateMentorById,
  deleteMentorById,
  getAllMentors,
  getActiveMentors,
  getInactiveMentors,
  connectMentorAndMentee,
  disconnectMentorAndMentee,
  createMentorBio,
  getMentorByfuid,
  getMentorMentees,
} = require("../Routes/Controllers/mentorController");

const mentorRouter = Router();

mentorRouter.post("/:firebaseUserId", addMentor);
mentorRouter.put("/connect", connectMentorAndMentee);
mentorRouter.get("/filter", getFilteredMentors);
mentorRouter.get("/id/:id", getMentorById);
mentorRouter.get("/uid/:firebaseUserId", getMentorByfuid);
mentorRouter.post("/createbio/:firebaseUserId", createMentorBio);
mentorRouter.put("/:firebaseUserId", updateMentorById);
mentorRouter.get("/mymentees/:firebaseUserId", getMentorMentees);

mentorRouter.get("/active", getActiveMentors);
mentorRouter.get("/inactive", getInactiveMentors);
mentorRouter.put("/deactivate/:mentorId", deActivateMentorById);
mentorRouter.put("/reactivate/:mentorId", reActivateMentorById);

mentorRouter.put("/disconnect", disconnectMentorAndMentee);

mentorRouter.get("/", getAllMentors);

mentorRouter.get("/my-mentors/:menteeId", getMentorsByMenteeId);

mentorRouter.delete("/:mentorId", deleteMentorById);

module.exports = mentorRouter;
