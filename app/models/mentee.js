const { Schema, model } = require("mongoose");
const { ObjectId } = Schema.Types;

const MenteeSchema = new Schema(
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

    standard: {
      type: String,
    },

    myMentors: [
      {
        type: ObjectId,
        ref: "mentors",
      },
    ],

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = model("mentees", MenteeSchema);
