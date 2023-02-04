const { Schema, model } = require("mongoose");
const { MENTEE, MENTOR } = require("../utils/RolesEnum");

const userSchema = new Schema(
  {
    uid: {
      type: String,
      unique: true,
      required: true,
    },
    role: {
      type: String,
      enum: [MENTEE, MENTOR],
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
    },
    address: {
      line1: String,
      line2: String,
      city: String,
      state: String,
      country: String,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    profilePic: String,
  },
  { timestamps: true }
);

module.exports = model("users", userSchema);
