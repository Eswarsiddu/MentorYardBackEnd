const Mentor = require("../../models/mentor");
const Mentee = require("../../models/mentee");
// const cloudinary = require("cloudinary").v2;

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_USER_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });
const ROLES = require("../../utils/RolesEnum");
const User = require("../../models/user");
// const { Base64 } = require("js-base64");

const createUser = async (req, res) => {
  const { name, email, uid, role } = req.body;
  console.log("creating user", { name, email, role });
  const userModel = role === ROLES.MENTEE ? Mentee : Mentor;
  try {
    const userObject = await User.create({ name, email, uid, role });
    await userModel.create({ uid, userId: userObject.id });
  } catch (e) {
    res.status(400).json({ msg: "error" });
    console.log("error", e);
    return;
  }
  console.log("user created");
  res.json({ msg: "sucessfully created" });
};

const userSignIn = async (req, res) => {
  const { uid, role } = req.body;
  try {
    const userObject = await User.findOne({ uid }).lean();
    if (userObject && userObject.role == role) {
      res.json({ msg: "sucessfull" });
    } else {
      res.status(400).json({ msg: "invalid credentials" });
    }
  } catch (e) {
    res.status(500).json({ msg: "server error" });
  }
};

const uploadProfile = async (req, res) => {
  const { uid } = req.params;
  // const { user } = req;
  // console.log(req)
  const userObject = await User.findOne({ uid });
  try {
    const result = await cloudinary.uploader.upload(`data`, {
      public_id: `${uid}_profile`,
      // width: 500,
      // height: 500,
      // crop: 'fill',
    });
    // console.log(result)
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { profilePic: result.url },
      { new: true }
    );
    res.status(201).json({
      success: true,
      message: "Your profile has updated!",
    });
  } catch (error) {
    res.status(500).json({
      success: error,
      message: "server error, try after some time",
    });
  }
};

const getRole = async (req, res) => {
  const { uid } = req.params;
  try {
    const userObject = await User.findOne({ uid });
    res.json({ role: userObject.role });
  } catch (e) {
    res.json({ msg: "server error" });
  }
};

const getBio = async (req, res) => {
  const { uid } = req.params;
  const { role } = req.query;
  const userObject = await User.findOne({ uid }).lean();
  if (!userObject.phoneNumber) {
    res.status(400).json({ msg: "not bio info" });
    return;
  }
  const bioData = {
    phoneNumber: userObject.phoneNumber,
    address: userObject.address,
    profilePic: userObject.profilePic,
  };
  if (role == ROLES.MENTOR) {
    const mentorObject = await Mentor.findOne({ uid });
    bioData.occupation = mentorObject.occupation;
    bioData.designation = mentorObject.designation;
  } else {
  }
  res.json(bioData);
};

const createBio = async (req, res) => {
  const { uid } = req.params;
  const { role } = req.query;
  const avatar = req.file;
  // console.log("avatart", Object.keys(avatar));
  const {
    profilePic,
    phoneNumber,
    line1,
    line2,
    city,
    state,
    country,
    standard,
    occupation,
    designation,
  } = req.body;
  console.log({ body: req.body });
  try {
    const userObject = await User.findOne({ uid });
    userObject.profilePic = profilePic;
    userObject.phoneNumber = phoneNumber;
    userObject.address = {
      line1,
      line2,
      city,
      state,
      country,
    };
    // const base64URI = Base64.encode(avatar.buffer);
    // const result = await cloudinary.uploader.upload(
    //   `data:${avatar.mimeType}:base64,${base64URI}`
    // );
    // userObject.profilePic = result.secure_url;
    await userObject.save();
    if (role == ROLES.MENTOR) {
      const mentorObject = await Mentor.findOne({ uid });
      mentorObject.occupation = occupation;
      mentorObject.designation = designation;
      await mentorObject.save();
    } else {
      const menteeObject = await Mentee.findOne({ uid });
      menteeObject.standard = standard;
      await menteeObject.save();
    }
    console.log("bio created");
    res.json({ msg: "sucesfull" });
  } catch (e) {
    console.log("error", Object.keys(e.error));
    console.log("code", e.error.code, "syscall", e.error.path.slice(0, 50));
    res.status(400).json({ msg: "some error" });
  }
};

module.exports = {
  createUser,
  userSignIn,
  uploadProfile,
  getRole,
  getBio,
  createBio,
};
