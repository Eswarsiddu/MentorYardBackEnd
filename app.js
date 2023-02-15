const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { mongoConnect } = require("./app/Services/mongo_connector");
const mentorRouter = require("./app/Routers/mentorRouter");
const menteeRouter = require("./app/Routers/menteeRouter");
const User = require("./app/models/user");

const app = express();
dotenv.config();
const port = process.env.PORT || 8000;
mongoConnect();

app.use(express.json());
app.use(cors());

app.use("/mentor", mentorRouter);
app.use("/mentee", menteeRouter);
app.get("/getrole/:firebaseUserId", async (req, res) => {
  const { firebaseUserId } = req.params;
  const user = await User.findOne({ firebaseUserId }).lean();
  console.log("user role", user);
  if (user) res.json({ role: user.role });
  else {
    res.status(400).json({ error: "error" });
  }
});

app.listen(port, () =>
  console.log(`server started at http://localhost:${port}`)
);
