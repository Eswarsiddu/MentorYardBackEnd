const Mentor = require("../../models/mentor");
const Mentee = require("../../models/mentee");
const mongoose = require("mongoose");
const validator = require("validator");


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
  const {
    name,
    email,
    photo,
    contact,
    company,
    occupation,
    designation,
    domain,
    address,
    isDeleted,
  } = req.body;

  // Validate input
  if (
    !name ||
    !email ||
    !contact ||
    !company ||
    !occupation ||
    !designation ||
    !domain ||
    !address
  ) {
    return res.status(400).send({
      status: "error",
      message:
        "Missing required fields. Please provide all the required fields",
    });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).send({
      status: "error",
      message: "Invalid email address",
    });
  }

  try {
    const mentorExists = await Mentor.findOne({ email });
    if (mentorExists) {
      return res.status(400).send({
        status: "error",
        message: "A mentor with the same email already exists",
      });
    }

    const newMentor = await Mentor.create({
      name,
      email,
      photo,
      contact,
      occupation,
      designation,
      domain,
      company,
      address,
      isDeleted,
    });
    if (newMentor) {
      res.send({
        status: "success",
        message: "Created new mentor",
        newMentor,
      });
    } else {
      res.status(400).send({
        status: "error",
        message: "Error creating new mentor",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      message: "Could not add mentor",
      error,
    });
  }
};

// Mentor Dashboard ------ My Profile
const getMentorById = async (req, res) => {
  const { mentorId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(mentorId)) {
    return res.status(400).send({
      status: "error",
      message: "Invalid mentor ID",
    });
  }

  try {
    const mentor = await Mentor.findOne({
      _id: mentorId,
      isDeleted: false,
    });
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

// Mentor Dashboard ------ Update Profile, Complete registration details
const updateMentorById = async (req, res) => {
  const { mentorId } = req.params;
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

  if (!name || !contact || !company || !occupation || !domain) {
    return res.status(400).send({
      status: "error",
      message: "All fields are mandatory fields and cannot be left blank.",
    });
  }

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
    const mentor = await Mentor.findById(mentorId);
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

    const updatedMentor = await Mentor.findByIdAndUpdate(
      mentorId,
      updatedData,
      { new: true, runValidators: true }
    );

    res.send({
      status: "success",
      message: "Mentor details updated successfully",
      updatedMentor,
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
    // // Update the mentee to remove the deleted mentor
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

// make connection
const connectMentorAndMentee = async (req, res) => {
  const { menteeId, mentorId } = req.body;

  if (
    !mongoose.Types.ObjectId.isValid(menteeId) ||
    !mongoose.Types.ObjectId.isValid(mentorId)
  ) {
    return res.status(400).send({
      status: "error",
      message: "Invalid Mentor or Mentee Id",
    });
  }

  try {
    const mentor = await Mentor.findOne({ _id: mentorId, isDeleted: false });
    if (!mentor) {
      return res.status(404).send({
        status: "error",
        message: "Mentor not found or deleted",
      });
    }
    const mentee = await Mentee.findOne({ _id: menteeId, isDeleted: false });
    if (!mentee) {
      return res.status(404).send({
        status: "error",
        message: "Mentee not found or deleted",
      });
    }
    await Mentor.findByIdAndUpdate(mentorId, {
      $addToSet: { myMentees: menteeId },
    });
    await Mentee.findByIdAndUpdate(menteeId, {
      $addToSet: { myMentors: mentorId },
    });
    res.send({
      status: "success",
      message: "Connected Successfully",
      mentor,
      mentee,
    });
  } catch (err) {
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

// Mentee dashboard - my-mentors
const getMentorsByMenteeId = async (req, res) => {
  const { menteeId } = req.params;
  try {
    // Validate the menteeId
    if (!menteeId || !mongoose.Types.ObjectId.isValid(menteeId)) {
      return res.status(400).send({
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
  const { name, occupation, designation, company, domain } = req.body;

  if (name) {
    filter.name = name;
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
    const mentors = await Mentor.find(filter).select(
      "name occupation designation company domain"
    );
    if (mentors.length === 0) {
      return res.status(404).send({
        status: "error",
        message: "No mentors found with the given filter criteria",
      });
    }
    res.send({
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

module.exports = {
  getFilteredMentors,
  getMentorsByMenteeId,
  getMentorById,
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
};
