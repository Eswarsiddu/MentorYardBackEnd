const validator = require("validator");
const { Schema, model } = require("mongoose");
const { ObjectId } = Schema.Types;

const MentorSchema = new Schema(
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
      maxlength: 150,
      validate: {
        validator: function (val) {
          let result = val.replace(/ /g, "");
          return validator.isAlpha(result);
        },
        message: "Name should contain only alphabets with or without spaces",
      },
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
      required: true,
    },
    company: {
      type: String,
    },
    occupation: {
      type: String,
      min: 6,
      max: 500,
    },

    designation: {
      type: String,
      minlength: 2,
      maxlength: 500,
      trim: true,
    },

    domain: {
      type: String,
      minlength: 2,
      maxlength: 500,
      trim: true,
    },

    address: {
      line1: String,
      line2: String,
      city: String,
      state: String,
      country: String,
    },

    myMentees: [
      {
        type: ObjectId,
        ref: "Mentee",
      },
    ],

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },

  { timestamps: true }
);

MentorSchema.pre("save", async function save(next) {
  this.increment();
  return next();
});

module.exports = model("Mentor", MentorSchema);
