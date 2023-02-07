const express = require("express");
require("dotenv").config();
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
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
// const studentRouter = require('./app/Routers/studentRouter');

const app = express();
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
//upload.single("file")
app.post("/createBio/:uid", createBio);
// app.use('/mentor', mentorRouter)
// app.use('/student', studentRouter)

app.listen(port, () =>
  console.log(`server started at http://localhost:${port}`)
);
