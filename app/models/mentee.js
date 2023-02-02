const { Schema, model } = require("mongoose");
const { ObjectId } = Schema.Types;

const MenteeSchema = new Schema(
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
    class: {
      type: String,
    },
    address: {
      line1: String,
      line2: String,
      city: String,
      state: String,
      country: String,
    },
    mentors: [
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
