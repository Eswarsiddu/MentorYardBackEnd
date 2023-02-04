const { Schema, model } = require("mongoose");
const { ObjectId } = Schema.Types;

const MenteeSchema = new Schema(
  {
    uid: {
      type: String,
      unique: true,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    standard: {
      type: String,
    },
    mentors: [
      {
        type: ObjectId,
        ref: "mentors",
      },
    ],
  },
  { timestamps: true }
);

module.exports = model("mentees", MenteeSchema);
