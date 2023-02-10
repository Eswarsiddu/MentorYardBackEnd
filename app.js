const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { mongoConnect } = require("./app/Services/mongo_connector");
const mentorRouter = require("./app/Routers/mentorRouter");
const menteeRouter = require("./app/Routers/menteeRouter");

const app = express();
dotenv.config();
const port = process.env.PORT || 8000;
mongoConnect();

app.use(express.json());
app.use(cors());

app.use("/mentor", mentorRouter);
app.use("/mentee", menteeRouter);

app.listen(port, () =>
  console.log(`server started at http://localhost:${port}`)
);
