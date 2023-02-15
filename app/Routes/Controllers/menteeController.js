const Mentee = require("../../models/mentee");
const Mentor = require("../../models/mentor");
const User = require("../..//models/user");
const mongoose = require("mongoose");
const ROLES = require("../../utils/enums/ROLES");
const validator = require("validator");

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
  const { firebaseUserId } = req.params;
  const { name, email } = req.body;
  console.log("uid", firebaseUserId, "name,email", name, email);
  // Validate input
  if (!name || !email) {
    return res.status(400).json({
      status: "error",
      message:
        "Missing required fields. Please provide all the required fields",
    });
  }
  try {
    const newMentee = await Mentee.create({
      name,
      email,
      firebaseUserId,
    });
    await User.create({ firebaseUserId, role: ROLES.MENTEE });
    res.json({
      status: "success",
      message: "Created new mentee",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: "Could not add mentee",
      error,
    });
  }
};

const createMenteeBio = async (req, res) => {
  const { firebaseUserId } = req.params;
  const { photo, contact, standard, address } = req.body;
  const mentee = await Mentee.findOne({ firebaseUserId });
  mentee.address = address;
  mentee.standard = standard;
  mentee.contact = contact;
  mentee.photo = photo;
  await mentee.save();
  res.json({
    status: "success",
    mentee,
  });
};

// Mentee Dashboard ------ My Profile
const getMenteeByfuid = async (req, res) => {
  const { firebaseUserId } = req.params;
  try {
    const mentee = await Mentee.findOne({ firebaseUserId });
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

const getMenteeById = async (req, res) => {
  const { id } = req.params;
  try {
    const mentee = await Mentee.findById(id);
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
  const { firebaseUserId } = req.params;
  const { name, email, photo, contact, standard, address } = req.body;
  console.log("update data", req.body);

  const updatedData = { name, email, photo, contact, standard, address };
  try {
    const mentee = await Mentee.findOne({ firebaseUserId });
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
      mentee._id,
      updatedData
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
    // removing mentee data from mentor collection
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
    console.log(mentees);
    if (mentees.length === 0) {
      res.status(404).send({
        status: "error",
        message: "No active Mentees found",
      });
    } else {
      res.send({
        status: "success",
        mentees,
        message: "Active Mentees fetched successfully",
      });
    }
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Error fetching Mentee data from database",
      error: error,
    });
  }
};

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
    const mentees = mentor.myMentees
      .filter((mentee) => !mentee.isDeleted)
      .map((mentee) => {
        return {
          name: mentee.name,
          email: mentee.email,
          photo: mentee.photo,
          standard: mentee.standard,
        };
      });
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

const getMenteeMentor = async (req, res) => {
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
    const mentees = mentor.myMentees
      .filter((mentee) => !mentee.isDeleted)
      .map((mentee) => {
        return {
          name: mentee.name,
          email: mentee.email,
          photo: mentee.photo,
          standard: mentee.standard,
        };
      });
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

const fetchMenteeData = async (req, res) => {
  try {
    const menteeId = req.params.menteeId;

    if (!mongoose.Types.ObjectId.isValid(menteeId)) {
      return res.status(400).send({
        status: "error",
        message: "Invalid mentee ID",
      });
    }

    const mentee = await Mentee.findById(menteeId);

    return res.send({
      status: "success",
      data: mentee,
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Error fetching Mentee data from database",
      error: error,
    });
  }
};

const getMenteeMentors = async (req, res) => {
  const { firebaseUserId } = req.params;
  try {
    const mentee = await Mentee.findOne({ firebaseUserId }, { myMentors: true })
      .populate("myMentors")
      .lean();
    const mentors = mentee.myMentors;
    console.log("mentee mentors", mentors);
    res.json(mentors);
  } catch (e) {
    console.log("e", e);
    return res.status(500).send({
      status: "error",
      message: "Error fetching Mentee data from database",
      error: e,
    });
  }
};

module.exports = {
  fetchMenteeData,
  createMenteeBio,
  getActiveMentees,
  getInactiveMentees,
  deActivateMenteeById,
  reactivateMenteeById,
  getAllMentees,
  getMenteeByfuid,
  getMenteeById,
  addMentee,
  updateMenteeById,
  deleteMenteeById,
  getMenteesByMentorId,
  getMenteeMentors,
};
