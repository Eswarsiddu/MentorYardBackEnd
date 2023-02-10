const { Schema, model } = require("mongoose");
const ROLES = require("../utils/enums/ROLES");

const userSchema = new Schema({
  firebaseUserId: {
    type: String,
    required: String,
    unique: true,
  },
  role: {
    type: String,
    enum: [ROLES.MENTEE, ROLES.MENTOR],
    required: true,
  },
});

// userSchema.pre("save", function (next) {
//   if (this.isModified("password")) {
//     bcrypt.hash(this.password, 8, (err, hash) => {
//       if (err) return next(err);
//       this.password = hash;
//       next();
//     });
//   }
// });

// userSchema.methods.comparePassword = async function (password) {
//   if (!password) throw new Error("Password is mission, can not compare!");
//   try {
//     const result = await bcrypt.compare(password, this.password);
//     return result;
//   } catch (error) {
//     console.log("Error while comparing password!", error.message);
//   }
// };
// userSchema.statics.isThisEmailInUse = async function (email) {
//   if (!email) throw new Error("Invalid Email");
//   try {
//     const user = await this.findOne({ email });
//     if (user) return false;
//     return true;
//   } catch (error) {
//     console.log("error inside isThisEmailInUse method", error.message);
//     return false;
//   }
// };

module.exports = model("User", userSchema);
