const { Router } = require("express");
const menteeRouter = Router();
const {
  fetchMenteeData,
  getMenteesByMentorId,
  getAllMentees,
  getMenteeById,
  addMentee,
  updateMenteeById,
  deleteMenteeById,
  getActiveMentees,
  getInactiveMentees,
  deActivateMenteeById,
  reactivateMenteeById,
  createMenteeBio,
  getMenteeByfuid,
  getMenteeMentors,
} = require("../Routes/Controllers/menteeController");

// MenteeRouter.use(authMiddleware)

menteeRouter.get("/", getAllMentees);
menteeRouter.get("/id/:id", getMenteeById);
menteeRouter.get("/uid/:firebaseUserId", getMenteeByfuid);
menteeRouter.post("/:firebaseUserId", addMentee);
menteeRouter.post("/createbio/:firebaseUserId", createMenteeBio);
menteeRouter.put("/:firebaseUserId", updateMenteeById);
menteeRouter.get("/mymentees/:firebaseUserId", getMenteesByMentorId);
menteeRouter.get("/mymentors/:firebaseUserId", getMenteeMentors);

menteeRouter.get("/fetch/:menteeId", fetchMenteeData);

menteeRouter.get("/active", getActiveMentees);
menteeRouter.get("/inactive", getInactiveMentees);
menteeRouter.put("/deactivate/:menteeId", deActivateMenteeById);
menteeRouter.put("/reactivate/:menteeId", reactivateMenteeById);

menteeRouter.delete("/:menteeId", deleteMenteeById);

module.exports = menteeRouter;
