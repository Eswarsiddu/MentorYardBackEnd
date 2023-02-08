const { Schema, model } = require("mongoose");
const { ObjectId } = Schema.Types;

const MenteeSchema = new Schema(
  {
    firebaseUserId: {
      type: String,
    },
    // password: {
    //   type: String,
    //   required: true,
    // },

    name: {
      type: String,
      minlength: 2,
      maxlength: 50,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    photo: {
      type: String,
    },

    contact: {
      type: String,
    },

    standard: {
      type: String,
      required: true,
    },

    
    address: {
      line1: String,
      line2: String,
      city: String,
      state: String,
      country: String,
    },

    myMentors: [
      {
        type: ObjectId,
        ref: "Mentor",
      },
    ],

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = model("Mentee", MenteeSchema);
