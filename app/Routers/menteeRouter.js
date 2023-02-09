const { Router } = require("express");
const menteeRouter = Router();
// const { uploadImageTos3 } = require('../Services/uploadToS3')
const {
  getAllMentees,
  getMenteeById,
  addMentee,
  updateMenteeById,
  deleteMenteeById,
  getActiveMentees,
  getInactiveMentees,
  deActivateMenteeById,
  reActivateMenteeById,
} = require("../Routes/Controllers/menteeController");

// MenteeRouter.use(authMiddleware)

menteeRouter.get("/", getAllMentees);
menteeRouter.get("/:menteeId", getMenteeById);

menteeRouter.get("/active", getActiveMentees);
menteeRouter.get("/inactive", getInactiveMentees);
menteeRouter.put("/deactivate/:menteeId", deActivateMenteeById);
menteeRouter.put("/reactivate/:menteeId", reActivateMenteeById);

menteeRouter.post("/", addMentee);
menteeRouter.put("/:menteeId", updateMenteeById);
menteeRouter.delete("/:menteeId", deleteMenteeById);

module.exports = menteeRouter;
