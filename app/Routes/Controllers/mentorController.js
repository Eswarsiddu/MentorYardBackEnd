const Mentor = require('../../models/Mentor');
const Mentee = require('../../models/mentee');

const getAllMentors = async (req, res) => {
  try {
    const mentors = await Mentor.find({});
    console.log(mentors);
    if (mentors.length===0) {
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



const addMentorByMenteeId = async (req, res) => {
  const { menteeId } = req.params;
  const { name, phoneNumber, email, occupation, designation } = req.body;

  try {
    const newMentor = await Mentor.create({
      name,
      phoneNumber,
      email,
      occupation,
      designation,
      menteeId,
    });
    const mentee = await Mentee.findByIdAndUpdate(menteeId, {
      $push: {
        myMentors: newMentor._id,
      },
    });
    res.send({
      status: "success",
      parent: newMentor,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "error",
      message: "Not added successfully",
    });
  }
};

const getMentorByMenteeId = async (req, res) => {
  const { studentId } = req.params
  try {
    let student = await Student.findById(studentId)
    if (!student) {
      res.status(404).send({
        status: 'error',
        message: 'student not found'
      })
    }
    else {
      let Mentor = await student.populate('parents')
      res.send({
        student: student.name,
        Mentor,
        status: 'Details fetched successfully',
      })
    }
  } catch (err) {
    res.send({
      status: 'error  details',
      message: err
    })
  }
}

const getMentorById = async (req, res) => {
  const { mentorId } = req.params
  try {
    const mentor = await Mentor.findById(mentorId)
    console.log(mentor)
    if (!Mentor) {
      res.status(404).send({
        status: 'error',
        message: 'Mentor not found'
      })
    } else {
      res.send({
        status: 'success',
        mentor
      })
    }
  } catch (err) {
    res.status(500).send({
      status: 'error',
      message: 'Error fetching Mentor from DB'
    })
  }
}

const updateMentorById = async (req, res) => {
  const { mentorId } = req.params
  const updatedData = req.body
  console.log(mentorId, updatedData)
  try {
    const updatedMentor = await Mentor.findByIdAndUpdate(mentorId,
      updatedData, { new: true, runValidators: true })
    if (!updatedMentor) {
      res.send({
        status: 'No such Mentor',
      })
    }
    else {
      res.send({
        status: 'Updated details Successfully',
        updatedMentor
      })
    }
  } catch (err) {
    res.status(500).send({
      status: ' Some error occurred',
      message: 'Cannot Update Mentor'
    })
  }
}

const deleteMentorById = async (req, res) => {
  const { mentorId } = req.params
  console.log(mentorId)
  try {
    const mentor = await Mentor.findByIdAndDelete(mentorId)
    const studentId = mentor.studentId
    const updateMentee = await Mentee.updateOne({ _id: studentId }, {
      $pull: {
        parents: mentorId
      }
    })
    res.send({
      status: 'Deleted Successfully',
      updateMentee
    })
  } catch (err) {
    res.status(500).send({
      status: 'Cannot delete internal error'
    })
  }
}

module.exports= {
  getMentorByMenteeId,
  getMentorById,
  addMentorByMenteeId,
  updateMentorById,
  deleteMentorById,
  getAllMentors
}