const Mentee = require("../../models/mentee");
// const Mentor = require("../../models/mentor");

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
      message: "Error fetching Mentee from DB",
    });
  }
};

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



module.exports = {
  getAllMentees,
  getMenteeById,
  addMentee,
  updateMenteeById,
  deleteMenteeById,
};
