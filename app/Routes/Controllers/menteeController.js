const Mentee = require("../../models/mentee");
// const Mentor = require("../../models/mentor");

// Admin Dashboard
const getAllMentees = async (req, res) => {
  try {
    let menteeList = await Mentee.find({});
    res.send({
      status: "Details fetched successfully",
      total: menteeList.length,
      menteeList,
    });
  } catch (err) {
    res.send({
      status: "error fetching details",
      message: err,
    });
  }
};

// Mentee Sign up
const addMentee = async (req, res) => {
  const { name, email, photo, contact, standard, address } = req.body;

  // Validate required fields
  if (!name || !email || !contact || !standard || !address) {
    return res.status(400).send({
      status: "error",
      message:
        "Name, email, contact, standard, and address are required fields",
    });
  }

  // Validate email format
  if (!validator.isEmail(email)) {
    return res.status(400).send({
      status: "error",
      message: "Invalid email format",
    });
  }

  // Validate contact format
  if (!validator.isMobilePhone(contact, "en-IN")) {
    return res.status(400).send({
      status: "error",
      message: "Invalid contact number format",
    });
  }

  const menteeData = {
    name,
    email,
    photo,
    contact,
    standard,
    address,
  };

  try {
    const newMentee = await Mentee.create(menteeData);
    res.send({
      status: "success",
      message: "Added new mentee successfully",
      mentee: newMentee,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      message: "Error adding mentee to the database",
      error,
    });
  }
};

// Mentee Dashboard ------ My Profile
const getMenteeById = async (req, res) => {
  const { menteeId } = req.params;
  try {
    const mentee = await Mentee.findOne({
      _id: menteeId,
      isDeleted: { $ne: true },
    });
    if (!mentee) {
      res.status(404).send({
        status: "error",
        message: "Mentee not found",
      });
    } else {
      res.send({
        status: "success",
        message: "Mentee data fetched successfully",
        mentee,
      });
    }
  } catch (err) {
    res.status(500).send({
      status: "error",
      message: "Error fetching Mentee data from database",
      error: err,
    });
  }
};

// Mentee Dashboard ------ update Profile, complete registration form
const updateMenteeById = async (req, res) => {
  const { menteeId } = req.params;
  const { name, email, photo, contact, standard, address } = req.body;

  const updatedData = { name, email, photo, contact, standard, address };
  try {
    const mentee = await Mentee.findById(menteeId);
    if (!mentee) {
      return res.status(404).send({
        status: "error",
        message: "Mentee not found",
      });
    }
    if (mentee.isDeleted) {
      return res.status(400).send({
        status: "error",
        message: "Mentee has been deleted",
      });
    }
    const updatedMentee = await Mentee.findByIdAndUpdate(
      menteeId,
      updatedData,
      { new: true, runValidators: true }
    );
    res.send({
      status: "success",
      message: "Updated Mentee details Successfully",
      updatedMentee,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      status: "error",
      message: "Could not update Mentee details, try again later",
    });
  }
};

// Admin/Mentee Dashboard ----- delete my account
const deleteMenteeById = async (req, res) => {
  const { menteeId } = req.params;
  try {
    const mentee = await Mentee.findById(menteeId);
    if (!mentee) {
      return res.status(404).send({
        status: "error",
        message: "Mentee not found",
      });
    }
    if (mentee.isDeleted) {
      return res.status(400).send({
        status: "error",
        message: "Mentee has already been deleted",
      });
    }
    mentee.isDeleted = true;
    await mentee.save();
    // remove mentee data from mentor collection
    await Mentor.updateMany(
      { mentees: menteeId },
      { $pull: { mentees: menteeId } }
    );
    res.send({
      status: "success",
      message: "Mentee has been deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      status: "error",
      message: "Could not delete Mentee, please try again later",
    });
  }
};

// Admin Dashboard
const getActiveMentees = async (req, res) => {
  try {
    const mentees = await Mentee.find({ isDeleted: false });
    if (mentees.length === 0) {
      return res.status(404).send({
        status: "error",
        message: "No active Mentees found",
      });
    }
    res.send({
      status: "success",
      message: "Fetched active Mentees successfully",
      mentees,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send({
      status: "error",
      message: "Could not fetch active Mentees, please try again later",
    });
  }
};

// Admin Dashboard
const getInactiveMentees = async (req, res) => {
  try {
    const mentees = await Mentee.find({ isDeleted: true });
    if (mentees.length === 0) {
      return res.status(404).send({
        status: "error",
        message: "No inactive Mentees found",
      });
    }
    res.send({
      status: "success",
      message: "Fetched inactive Mentees successfully",
      mentees,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send({
      status: "error",
      message: "Could not fetch inactive Mentees, please try again later",
    });
  }
};

// Mentee Dashboard ------ de-activate-account
const deActivateMenteeById = async (req, res) => {
  const { menteeId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(menteeId)) {
      return res.status(400).send({
        status: "error",
        message: "Invalid Mentee Id",
      });
    }

    const mentee = await Mentee.findById(menteeId);
    if (!mentee) {
      return res.status(404).send({
        status: "error",
        message: "No such Mentee found",
      });
    }

    const updatedMentee = await Mentee.findByIdAndUpdate(
      menteeId,
      { isDeleted: true },
      { new: true, runValidators: true }
    );

    res.send({
      status: "success",
      message: "Mentee deactivated successfully",
      updatedMentee,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send({
      status: "error",
      message: "Could not deactivate Mentee, please try again later",
    });
  }
};

// Mentee Dashboard ------ activate-account
const reactivateMenteeById = async (req, res) => {
  const { menteeId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(menteeId)) {
      return res.status(400).send({
        status: "error",
        message: "Invalid Mentee Id",
      });
    }

    const mentee = await Mentee.findById(menteeId);
    if (!mentee) {
      return res.status(404).send({
        status: "error",
        message: "No such Mentee found",
      });
    }

    const updatedMentee = await Mentee.findByIdAndUpdate(
      menteeId,
      { isDeleted: false },
      { new: true, runValidators: true }
    );

    res.send({
      status: "success",
      message: "Mentee reactivated successfully",
      updatedMentee,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send({
      status: "error",
      message: "Could not reactivate Mentee, please try again later",
    });
  }
};

const getMenteesByMentorId = async (req, res) => {
  const mentorId = req.params.mentorId;
  try {
    const mentor = await Mentor.findById(mentorId).populate("myMentees");
    if (!mentor) {
      return res.status(404).send({
        status: "error",
        message: "Mentor not found",
      });
    }
    if (mentor.isDeleted) {
      return res.status(404).send({
        status: "error",
        message: "Mentor has been deleted",
      });
    }
    const mentees = mentor.myMentees.filter((mentee) => !mentee.isDeleted);
    res.send({
      status: "success",
      message: "Mentees retrieved successfully",
      mentees,
    });
  } catch (err) {
    res.status(500).send({
      status: "error",
      message: "Could not retrieve mentees",
      err,
    });
  }
};







module.exports = {
  getActiveMentees,
  getInactiveMentees,
  deActivateMenteeById,
  reactivateMenteeById,
  getAllMentees,
  getMenteeById,
  addMentee,
  updateMenteeById,
  deleteMenteeById,
  getMenteesByMentorId,
};
