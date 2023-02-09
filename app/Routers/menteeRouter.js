const { Router } = require("express");
const menteeRouter = Router();
// const { uploadImageTos3 } = require('../Services/uploadToS3')
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
} = require("../Routes/Controllers/menteeController");

// MenteeRouter.use(authMiddleware)

menteeRouter.get("/", getAllMentees);
menteeRouter.get("/get/:menteeId", getMenteeById);

menteeRouter.get("/active", getActiveMentees);
menteeRouter.get("/inactive", getInactiveMentees);
menteeRouter.put("/deactivate/:menteeId", deActivateMenteeById);
menteeRouter.put("/reactivate/:menteeId", reactivateMenteeById);

menteeRouter.post("/", addMentee);
menteeRouter.put("/:menteeId", updateMenteeById);
menteeRouter.delete("/:menteeId", deleteMenteeById);
menteeRouter.get("/my-mentees/:mentorId", getMenteesByMentorId);

module.exports = menteeRouter;
