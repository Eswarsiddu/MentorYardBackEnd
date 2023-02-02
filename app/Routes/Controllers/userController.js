const Mentor = require("../../models/mentor");
const Mentee = require("../../models/mentee");
const cloudinary = require("../../Services/cloudinary");
const ROLES = require("../../utils/RolesEnum");

const createUser = async (req, res) => {
  const { name, email, uid, role } = req.body;
  console.log({ name, email, role });
  const userModel = role === ROLES.MENTEE ? Mentee : Mentor;
  try {
    await userModel.create({ uid, email, name });
  } catch (e) {
    res.status(400).json({ msg: "error" });
    console.log("error");
    return;
  }
  console.log("user created");
  res.json({ msg: "sucessfully created" });
};

const userSignIn = async (req, res) => {
  const { uid, role } = req.body;
  console.log({ uid, role });
  const userModel = role === ROLES.MENTEE ? Mentee : Mentor;
  // Mentee.collection.name
  try {
    const user = await userModel.findOne({ uid });
    console.log(user, userModel.collection.name);
    if (user) {
      res.json({ msg: "sucessfull" });
    } else {
      res.status(400).json({ msg: "invalid credentials" });
    }
  } catch (e) {
    res.status(500).json({ msg: "server error" });
  }
};

const uploadProfile = async (req, res) => {
  const { user } = req;
  // console.log(req)
  if (!user)
    return res.status(401).json({
      success: false,
      message: "unauthorized access!",
    });
  // console.log(user)
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      public_id: `${user._id}_profile`,
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
    let user = await Mentee.findOne({ uid }).lean();
    if (user) {
      res.json({ role: ROLES.MENTEE });
      return;
    }
    user = await Mentor.findOne({ uid }).lean();
    if (user) {
      res.json({ role: ROLES.MENTOR });
      return;
    }
    res.status(400).json({ msg: "no user" });
  } catch (e) {
    res.json({ msg: "server error" });
  }
};

const hasBio = async (req, res) => {
  const { uid } = req.params;
  const { role } = req.query;
  console.log({ uid, role });
  res.json(true);
};

module.exports = {
  createUser,
  userSignIn,
  uploadProfile,
  hasBio,
  getRole,
};
