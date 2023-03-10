const Mentor = require("../../models/mentor");
const Mentee = require("../../models/mentee");
const User = require("../../models/user");
const mongoose = require("mongoose");
const ROLES = require("../../utils/enums/ROLES");
const validator = require("validator");
const mentor = require("../../models/mentor");

// Admin Dashboard
const getAllMentors = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const skip = parseInt(req.query.skip) || 0;

    if (limit < 0) {
      return res.status(400).send({
        status: "error",
        message: "Limit must be a positive integer",
      });
    }

    if (skip < 0) {
      return res.status(400).send({
        status: "error",
        message: "Skip must be a positive integer",
      });
    }

    const mentors = await Mentor.find(
      {},
      {
        _id: 0,
        email: 0,
        address: 0,
        isDeleted: 0,
        createdAt: 0,
        updatedAt: 0,
        __v: 0,
        contact: 0,
      }
    )
      .limit(limit)
      .skip(skip);
    // .select("name photo contact company occupation designation domain");

    const mentorCount = await Mentor.countDocuments();

    if (mentors.length === 0) {
      res.status(404).send({
        status: "error",
        message: "No Mentors found",
      });
    } else {
      res.send({
        status: "successful",
        mentorCount,
        mentors,
      });
    }
  } catch (err) {
    res.status(500).send({
      status: "error",
      message: "Error fetching Mentors from DB",
    });
  }
};

// Mentor Sign up
const addMentor = async (req, res) => {
  const { firebaseUserId } = req.params;
  const { name, email } = req.body;

  // Validate input
  if (!name || !email) {
    return res.status(400).json({
      status: "error",
      message:
        "Missing required fields. Please provide all the required fields",
    });
  }

  try {
    const newMentor = await Mentor.create({
      name,
      email,
      firebaseUserId,
    });
    await User.create({ firebaseUserId, role: ROLES.MENTOR });
    res.json({
      status: "success",
      message: "Created new mentor",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: "Could not add mentor",
      error,
    });
  }
};

const createMentorBio = async (req, res) => {
  const { firebaseUserId } = req.params;
  const { photo, contact, occupation, designation, domain, company, address } =
    req.body;
  const mentor = await Mentor.findOne({ firebaseUserId });
  mentor.address = address;
  mentor.company = company;
  mentor.designation = designation;
  mentor.domain = domain;
  mentor.occupation = occupation;
  mentor.contact = contact;
  mentor.photo = photo;
  await mentor.save();
  res.json({
    status: "success",
    mentor,
  });
};

// Mentor Dashboard ------ My Profile
const getMentorByfuid = async (req, res) => {
  const { firebaseUserId } = req.params;
  try {
    const mentor = await Mentor.findOne({ firebaseUserId });
    if (!mentor) {
      res.status(404).send({
        status: "error",
        message: "No such mentor ",
      });
    } else {
      res.send({
        status: "success",
        message: "Successfully got mentor details",
        mentor,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      message: "Error fetching data from the database",
      error,
    });
  }
};

const getMentorById = async (req, res) => {
  const { id } = req.params;
  try {
    const mentor = await Mentor.findById(id);
    if (!mentor) {
      res.status(404).send({
        status: "error",
        message: "No such mentor ",
      });
    } else {
      res.send({
        status: "success",
        message: "Successfully got mentor details",
        mentor,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      message: "Error fetching data from the database",
      error,
    });
  }
};

//TODO: update
// Mentor Dashboard ------ Update Profile, Complete registration details
const updateMentorById = async (req, res) => {
  const { firebaseUserId } = req.params;
  const {
    name,
    photo,
    contact,
    company,
    occupation,
    designation,
    domain,
    address,
  } = req.body;

  const updatedData = {
    name,
    photo,
    contact,
    company,
    occupation,
    designation,
    domain,
    address,
  };

  try {
    const mentor = await Mentor.findOne({ firebaseUserId });
    if (!mentor) {
      return res.status(404).send({
        status: "error",
        message: "No such mentor found",
      });
    }

    if (mentor.isDeleted) {
      return res.status(400).send({
        status: "error",
        message: "Cannot update a deleted mentor",
      });
    }

    Object.assign(mentor, updatedData);
    await mentor.save();

    res.send({
      status: "success",
      message: "Mentor details updated successfully",
      mentor,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send({
      status: "error",
      message: "Could not update mentor details, please try again later",
    });
  }
};

// Admin/Mentor ------delete my account
const deleteMentorById = async (req, res) => {
  const { mentorId } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(mentorId)) {
      return res.status(400).send({
        status: "error",
        message: "Invalid mentorId provided",
      });
    }
    const deletedMentor = await Mentor.findByIdAndDelete(mentorId);
    if (!deletedMentor) {
      return res.status(400).send({
        status: "error",
        message: "No such mentor found",
      });
    }
    // Update the mentee to remove the deleted mentor
    const menteeId = deletedMentor.menteeId;
    const updateMentee = await Mentee.updateOne(
      { _id: menteeId },
      {
        $pull: {
          myMentors: mentorId,
        },
      }
    );
    res.send({
      status: "success",
      message: "Deleted Successfully",
      deletedMentor,
    });
  } catch (err) {
    res.status(500).send({
      status: "error",
      message: "Internal error. Cannot delete mentor",
    });
  }
};

// Mentor/home ------ my account
const getActiveMentors = async (req, res) => {
  try {
    const mentors = await Mentor.find({ isDeleted: false });
    console.log(mentors);
    if (mentors.length === 0) {
      res.status(404).send({
        status: "error",
        message: "No active Mentors found",
      });
    } else {
      res.send({
        status: "success",
        mentors,
        message: "Active Mentors fetched successfully",
      });
    }
  } catch (err) {
    res.status(500).send({
      status: "error",
      message: "Error fetching Mentor from DB",
    });
  }
};

// Admin/mentor Dashboard
const getInactiveMentors = async (req, res) => {
  try {
    const mentors = await Mentor.find({ isDeleted: true });
    console.log(mentors);
    if (mentors.length === 0) {
      res.status(404).send({
        status: "error",
        message: "No inactive Mentors found",
      });
    } else {
      res.send({
        status: "success",
        mentors,
        message: "Inactive Mentors fetched successfully",
      });
    }
  } catch (err) {
    res.status(500).send({
      status: "error",
      message: "Error fetching Mentor from DB",
    });
  }
};

// Mentor Dashboard ------ de-activate-account
const deActivateMentorById = async (req, res) => {
  const { mentorId } = req.params;
  if (!mentorId) {
    return res.status(400).send({
      status: "error",
      message: "Mentor Id is required",
    });
  }
  try {
    const mentor = await Mentor.findById(mentorId);
    if (!mentor) {
      res.status(400).send({
        status: "error",
        message: "No such Mentor found",
      });
    } else if (mentor.isDeleted) {
      res.status(400).send({
        status: "error",
        message: "Mentor is already de-activated",
      });
    } else {
      const updatedMentor = await Mentor.findByIdAndUpdate(
        mentorId,
        { isDeleted: true },
        { new: true, runValidators: true }
      );
      res.send({
        status: "success",
        message: "Mentor de-activated successfully",
        updatedMentor,
      });
    }
  } catch (err) {
    res.status(500).send({
      status: "error",
      message: "Cannot de-activate Mentor",
      err,
    });
  }
};

const reActivateMentorById = async (req, res) => {
  const { mentorId } = req.params;
  if (!mentorId) {
    return res.status(400).send({
      status: "error",
      message: "Mentor id is missing",
    });
  }
  try {
    const mentor = await Mentor.findById(mentorId);
    if (!mentor) {
      return res.status(404).send({
        status: "error",
        message: "No such Mentor found",
      });
    }
    if (!mentor.isDeleted) {
      return res.status(400).send({
        status: "error",
        message: "Mentor is already active",
      });
    }
    const updatedMentor = await Mentor.findByIdAndUpdate(
      mentorId,
      { isDeleted: false },
      { new: true, runValidators: true }
    );
    return res.send({
      status: "success",
      message: "Updated details Successfully",
      updatedMentor,
    });
  } catch (err) {
    return res.status(500).send({
      status: " error ",
      message: "Cannot Update Mentor",
      err,
    });
  }
};

//TODO: modify
// make connection
const connectMentorAndMentee = async (req, res) => {
  const { menteeId, mentorId } = req.body;
  console.log("connect", { menteeId, mentorId });
  try {
    const mentor = await Mentor.findById(mentorId);
    if (!mentor) {
      return res.status(404).send({
        status: "error",
        message: "Mentor not found or deleted",
      });
    }
    const mentee = await Mentee.findOne({ firebaseUserId: menteeId });
    if (!mentee) {
      return res.status(404).send({
        status: "error",
        message: "Mentee not found or deleted",
      });
    }
    mentor.myMentees.push(mentee._id);
    mentee.myMentors.push(mentor._id);
    mentor.myMentees = Array.from(new Set(mentor.myMentees));
    mentee.myMentors = Array.from(new Set(mentee.myMentors));
    await mentor.save();
    await mentee.save();
    // await Mentor.findByIdAndUpdate(mentorId, {
    //   $addToSet: { myMentees: menteeId },
    // });
    // await Mentee.findByIdAndUpdate(menteeId, {
    //   $addToSet: { myMentors: mentorId },
    // });
    res.send({
      status: "success",
      message: "Connected Successfully",
      mentor,
      mentee,
    });
  } catch (err) {
    console.log("error", err);
    res.status(500).send({
      status: "error",
      message: "Could not connect, please try again later",
      err,
    });
  }
};

// remove connection
const disconnectMentorAndMentee = async (req, res) => {
  const { menteeId, mentorId } = req.body;
  try {
    const mentor = await Mentor.findByIdAndUpdate(mentorId, {
      $pull: { myMentees: menteeId },
    });
    const mentee = await Mentee.findByIdAndUpdate(menteeId, {
      $pull: { myMentors: mentorId },
    });
    res.send({
      status: "success",
      message: "disconnected Successfully",
      mentor,
      mentee,
    });
  } catch (err) {
    res.status(500).send({
      status: " error ",
      message: "Could not disconnect",
      err,
    });
  }
};

//TODO: Update
// Mentee dashboard - my-mentors
const getMentorsByMenteeId = async (req, res) => {
  const { menteeId } = req.params;
  try {
    // Validate the menteeId
    if (!menteeId || !mongoose.Types.ObjectId.isValid(menteeId)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid menteeId provided",
      });
    }

    let mentee = await Mentee.findById(menteeId, { _id: 0, name: 1 }).populate(
      "myMentors",
      {
        name: 1,
        designation: 1,
        domain: 1,
        _id: 0,
        occupation: 1,
        company: 1,
        photo: 1,
      }
    );

    // Check if mentee is found
    if (!mentee) {
      return res.status(404).send({
        status: "error",
        message: "Mentee not found",
      });
    }

    // Check if mentee has any mentors
    if (!mentee.myMentors || mentee.myMentors.length === 0) {
      return res.status(404).send({
        status: "error",
        message: "Mentee does not have any mentors",
      });
    }

    res.send({
      mentorsList: mentee.myMentors,
      status: "success",
      message: "Details fetched successfully",
    });
  } catch (err) {
    res.send({
      status: "error",
      message: "An error occurred while fetching mentors for the mentee",
      error: err,
    });
  }
};

// mentee dashboard filter
const getFilteredMentors = async (req, res) => {
  let filter = {};
  const { name, occupation, designation, company, domain } = req.query;

  if (name) {
    filter.name = { $regex: name, $options: "i" };
  }
  if (occupation) {
    filter.occupation = occupation;
  }

  if (designation) {
    filter.designation = designation;
  }

  if (company) {
    filter.company = company;
  }

  if (domain) {
    filter.domain = domain;
  }

  try {
    const mentors = await Mentor.find(filter);
    if (mentors.length === 0) {
      return res.status(404).send({
        status: "error",
        message: "No mentors found with the given filter criteria",
      });
    }
    res.json({
      status: "success",
      message: "Mentors filtered successfully",
      mentors,
    });
  } catch (err) {
    return res.status(500).send({
      status: "error",
      message: "Error filtering mentors",
      error: err,
    });
  }
};

const getMentorMentees = async (req, res) => {
  const { firebaseUserId } = req.params;
  try {
    const mentor = await Mentor.findOne({ firebaseUserId }, { myMentors: true })
      .populate("myMentees")
      .lean();
    const mentees = mentor.myMentees;
    console.log("mentee mentors", mentees);
    res.json(mentees);
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
  getFilteredMentors,
  getMentorsByMenteeId,
  getMentorByfuid,
  getMentorById,
  createMentorBio,
  addMentor,
  updateMentorById,
  deleteMentorById,
  getAllMentors,
  getActiveMentors,
  getInactiveMentors,
  deActivateMentorById,
  reActivateMentorById,
  connectMentorAndMentee,
  disconnectMentorAndMentee,
  getMentorMentees,
};
