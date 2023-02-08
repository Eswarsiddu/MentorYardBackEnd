const Mentor = require("../../models/Mentor");
const Mentee = require("../../models/mentee");

const getAllMentors = async (req, res) => {
  try {
    const mentors = await Mentor.find({});
    console.log(mentors);
    if (mentors.length === 0) {
      res.status(404).send({
        status: "error",
        message: "No Mentors found",
      });
    } else {
      res.send({
        status: "successful",
        mentors,
      });
    }
  } catch (err) {
    res.status(500).send({
      status: "error",
      message: "Error fetching Mentor from DB",
    });
  }
};

// Mentor Dashboard
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
  try {
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
        message: " Error Creating new mentor",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      message: "Could Not be added successfully",
      error,
    });
  }
};

const getMentorById = async (req, res) => {
  const { mentorId } = req.params;
  try {
    const mentor = await Mentor.findById(mentorId);
    console.log(mentor);
    if (!mentor) {
      res.status(404).send({
        status: "error",
        message: "No such mentor",
      });
    } else {
      res.send({
        status: "success",
        message: "successfully got mentor details",
        mentor,
      });
    }
  } catch (err) {
    res.status(500).send({
      status: "error",
      message: "Error fetching data from DB",
      err,
    });
  }
};

const updateMentorById = async (req, res) => {
  const { mentorId } = req.params;
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
  // console.log(mentorId, updatedData);
  const updatedData = {
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
  };
  try {
    const updatedMentor = await Mentor.findByIdAndUpdate(
      mentorId,
      updatedData,
      { new: true, runValidators: true }
    );
    if (!updatedMentor) {
      res.status(400).send({
        status: "error",
        message: "No such Mentor found",
      });
    } else {
      res.send({
        status: "success",
        message: "Updated details Successfully",
        updatedMentor,
      });
    }
  } catch (err) {
    res.status(500).send({
      status: " error ",
      message: "Cannot Update Mentor",
      err,
    });
  }
};

const deleteMentorById = async (req, res) => {
  const { mentorId } = req.params;
  console.log(mentorId);
  try {
    const deletedMentor = await Mentor.findByIdAndDelete(mentorId);
    // const menteeId = mentor.menteeId;
    // const updateMentee = await Mentee.updateOne(
    //   { _id: menteeId },
    //   {
    //     $pull: {
    //       myMentors : mentorId,
    //     },
    //   }
    // );
    res.send({
      status: "success",
      message: "Deleted Successfully",
      deletedMentor,
    });
  } catch (err) {
    res.status(500).send({
      status: "Cannot delete internal error",
    });
  }
};

const getActiveMentors = async (req, res) => {
  try {
    const mentors = await Mentor.find({ isDeleted: false });
    console.log(mentors);
    if (mentors.length === 0) {
      res.status(404).send({
        status: "error",
        message: "No Mentors found",
      });
    } else {
      res.send({
        status: "successful",
        mentors,
      });
    }
  } catch (err) {
    res.status(500).send({
      status: "error",
      message: "Error fetching Mentor from DB",
    });
  }
};

const getDeactivatedMentors = async (req, res) => {
  try {
    const mentors = await Mentor.find({ isDeleted: true });
    console.log(mentors);
    if (mentors.length === 0) {
      res.status(404).send({
        status: "error",
        message: "No Mentors found",
      });
    } else {
      res.send({
        status: "successful",
        mentors,
      });
    }
  } catch (err) {
    res.status(500).send({
      status: "error",
      message: "Error fetching Mentor from DB",
    });
  }
};

const deActivateMentorById = async (req, res) => {
  const { mentorId } = req.params;
  try {
    const updatedMentor = await Mentor.findByIdAndUpdate(
      mentorId,
      { isDeleted: true },
      { new: true, runValidators: true }
    );
    if (!updatedMentor) {
      res.status(400).send({
        status: "error",
        message: "No such Mentor found",
      });
    } else {
      res.send({
        status: "success",
        message: "Updated details Successfully",
        updatedMentor,
      });
    }
  } catch (err) {
    res.status(500).send({
      status: " error ",
      message: "Cannot Update Mentor",
      err,
    });
  }
};

const reActivateMentorById = async (req, res) => {
  const { mentorId } = req.params;
  try {
    const updatedMentor = await Mentor.findByIdAndUpdate(
      mentorId,
      { isDeleted: false },
      { new: true, runValidators: true }
    );
    if (!updatedMentor) {
      res.status(400).send({
        status: "error",
        message: "No such Mentor found",
      });
    } else {
      res.send({
        status: "success",
        message: "Updated details Successfully",
        updatedMentor,
      });
    }
  } catch (err) {
    res.status(500).send({
      status: " error ",
      message: "Cannot Update Mentor",
      err,
    });
  }
};

const connectMentorAndMentee = async (req, res) => {
  const { menteeId, mentorId } = req.body;
  try {
    const mentor = await Mentor.findByIdAndUpdate(mentorId, {
      $addToSet: { myMentees: menteeId },
    });
    const mentee = await Mentee.findByIdAndUpdate(menteeId, {
      $addToSet: { myMentors: mentorId },
    });
    res.send({
      status: "success",
      message: "connected Successfully",
      mentor,
      mentee,
    });
  } catch (err) {
    res.status(500).send({
      status: " error ",
      message: "Could nnot connect",
      err,
    });
  }
};

// Mentee dashboard - my-mentors
const getMentorsByMenteeId = async (req, res) => {
  const { menteeId } = req.params;
  try {
    let mentee = await Mentee.findById(menteeId).populate("mentors");
    if (!mentee) {
      res.status(404).send({
        status: "error",
        message: "student not found",
      });
    } else {
      // let mentors = await mentee.populate("myMentors");
      res.send({
        mentee: mentee,
        // mentors,
        status: "success",
        message: "Details fetched successfully",
      });
    }
  } catch (err) {
    res.send({
      status: "error  details",
      message: err,
    });
  }
};

module.exports = {
  getMentorsByMenteeId,
  getMentorById,
  addMentor,
  updateMentorById,
  deleteMentorById,
  getAllMentors,
  getActiveMentors,
  getDeactivatedMentors,
  deActivateMentorById,
  reActivateMentorById,
  connectMentorAndMentee,
};
