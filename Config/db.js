const mongoose = require("mongoose");
const MONGODB_URI = "mongodb://localhost/Adarin-Labs";
mongoose.connect(MONGODB_URI);
mongoose.connection
  .on("open", () => {
    console.log("Conntcted to DATABASE Sucessfully...");
  })
  .once("error", () => {
    console.log("Failed to connect to DATABASE!!!");
  });

module.exports = mongoose;
