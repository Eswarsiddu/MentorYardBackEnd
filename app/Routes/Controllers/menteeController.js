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
      status: "Added new Mentee successfully",
      mentee: newMentee,
    });
  } catch (err) {
    res.status(500).send({
      status: "error occurred",
      msg: err,
    });
  }
};

// Mentee Dashboard ------ My Profile
const getMenteeById = async (req, res) => {
  const { menteeId } = req.params;
  try {
    const mentee = await Mentee.findById(menteeId);
    if (!mentee) {
      res.status(404).send({
        status: "error",
        message: "Mentee data not found",
      });
    } else {
      res.send({
        status: "success",
        mentee,
      });
    }
  } catch (err) {
    res.status(500).send({
      status: "error",
      message: "Error fetching Mentee from DuuuuB",
    });
  }
};

// Mentee Dashboard ------ update Profile, complete registration form
const updateMenteeById = async (req, res) => {
  const { menteeId } = req.params;
  const updatedData = req.body;
  try {
    const updatedMentee = await Mentee.findByIdAndUpdate(
      menteeId,
      updatedData,
      { new: true, runValidators: true }
    );
    res.send({
      status: "Updated details Successfully",
      updatedMentee,
    });
  } catch (err) {
    res.status(500).send({
      status: " Some error occurred",
      msg: "Cannot Update Mentee",
    });
  }
};

// Admin/Mentee Dashboard ----- delete my account
const deleteMenteeById = async (req, res) => {
  const { menteeId } = req.params;
  console.log(menteeId);
  try {
    const mentee = await Mentee.findByIdAndDelete(menteeId);
    res.send({
      status: "Deleted Successfully",
      mentee,
    });
  } catch (err) {
    res.status(500).send({
      status: "Cannot delete internal error",
    });
  }
};

// Admin Dashboard
const getActiveMentees = async (req, res) => {
  console.log("mentees called");

  try {
    const mentees = await Mentee.find();
    console.log("mentees", mentees);
    if (mentees.length === 0) {
      res.status(404).send({
        status: "error",
        message: "No Mentees found",
      });
    } else {
      res.send({
        status: "successful",
        mentees,
      });
    }
  } catch (err) {
    res.status(500).send({
      status: "error",
      message: "Error fetching Mentee",
      err,
    });
  }
};

// Admin Dashboard
const getInactiveMentees = async (req, res) => {
  try {
    const mentees = await Mentee.find({ isDeleted: true });
    console.log(mentees);
    if (mentees.length === 0) {
      res.status(404).send({
        status: "error",
        message: "No Mentees found",
      });
    } else {
      res.send({
        status: "successful",
        mentees,
      });
    }
  } catch (err) {
    res.status(500).send({
      status: "error",
      message: "Error fetching Mentee from ",
    });
  }
};

// Mentee Dashboard ------ de-activate-account
const deActivateMenteeById = async (req, res) => {
  const { menteeId } = req.params;
  try {
    const updatedMentee = await Mentee.findByIdAndUpdate(
      menteeId,
      { isDeleted: true },
      { new: true, runValidators: true }
    );
    if (!updatedMentee) {
      res.status(400).send({
        status: "error",
        message: "No such Mentee found",
      });
    } else {
      res.send({
        status: "success",
        message: "Updated details Successfully",
        updatedMentee,
      });
    }
  } catch (err) {
    res.status(500).send({
      status: " error ",
      message: "Cannot Update Mentee",
      err,
    });
  }
};

// Mentee Dashboard ------ activate-account
const reActivateMenteeById = async (req, res) => {
  const { menteeId } = req.params;
  try {
    const updatedMentee = await Mentee.findByIdAndUpdate(
      menteeId,
      { isDeleted: false },
      { new: true, runValidators: true }
    );
    if (!updatedMentee) {
      res.status(400).send({
        status: "error",
        message: "No such Mentee found",
      });
    } else {
      res.send({
        status: "success",
        message: "Updated details Successfully",
        updatedMentee,
      });
    }
  } catch (err) {
    res.status(500).send({
      status: " error ",
      message: "Cannot Update Mentee",
      err,
    });
  }
};

module.exports = {
  getActiveMentees,
  getInactiveMentees,
  deActivateMenteeById,
  reActivateMenteeById,
  getAllMentees,
  getMenteeById,
  addMentee,
  updateMenteeById,
  deleteMenteeById,
};
