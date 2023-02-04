const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { mongoConnect } = require("./app/Services/mongo_connector");
// const mentorRouter = require("./app/Routers/familyRouter");
const {
  createUser,
  userSignIn,
  getRole,
  hasBio,
  getBio,
  createBio,
} = require("./app/Routes/Controllers/userController");
// const studentRouter = require('./app/Routers/studentRouter');

const app = express();
dotenv.config();
const port = process.env.PORT || 8000;
mongoConnect();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.post("/createuser", createUser);
// app.put("/checkrole", userSignIn);
app.get("/getRole/:uid", getRole);
// app.get("/hasbio/:uid", hasBio);
app.get("/getBio/:uid", getBio);
app.post("/createBio/:uid", createBio);
// app.use('/mentor', mentorRouter)
// app.use('/student', studentRouter)

app.listen(port, () =>
  console.log(`server started at http://localhost:${port}`)
);
