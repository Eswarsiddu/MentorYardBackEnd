const { Schema, model } = require("mongoose");
const { ObjectId } = Schema.Types;

const MentorSchema = new Schema(
  {
    firebaseUserId: {
      type: String,
      required: String,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    photo: {
      type: String,
    },

    contact: {
      type: String,
    },

    address: {
      line1: String,
      line2: String,
      city: String,
      state: String,
      country: String,
    },

    company: {
      type: String,
    },
    occupation: {
      type: String,
    },

    designation: {
      type: String,
    },

    domain: {
      type: String,
    },

    myMentees: [
      {
        type: ObjectId,
        ref: "mentees",
      },
    ],

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },

  { timestamps: true }
);

module.exports = model("mentors", MentorSchema);
