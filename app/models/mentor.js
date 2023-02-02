const { Schema, model } = require("mongoose");
const { ObjectId } = Schema.Types;

const MentorSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    uid: {
      type: String,
      unique: true,
      required: true,
    },
    phoneNumber: {
      type: String,
    },
    occupation: {
      type: String,
    },
    designation: {
      type: String,
    },
    mentees: [
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
