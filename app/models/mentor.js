const { Schema, model } = require("mongoose");
const { ObjectId } = Schema.Types;

const MentorSchema = new Schema(
  {
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
