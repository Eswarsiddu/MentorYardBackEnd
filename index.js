const express = require("express");
const app = express();
app.get("/", (req, res) => {
  res.send("hello");
});
app.listen(8000 | process.env.PORT, () => {
  console.log("server started");
});
