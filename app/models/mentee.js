const { Schema, model } = require("mongoose");
const { ObjectId } = Schema.Types;

const MenteeSchema = new Schema(
  {
    class: {
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
