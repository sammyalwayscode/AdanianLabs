const express = require("express");
const PORT = 3022;
const app = express();
require("./Config/db");
const usersRoute = require("./Routes/Router");
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("API Is up and RUNNING...");
});

app.use("/api", usersRoute);

app.listen(PORT, () => {
  console.log(`Server Listening to PORT: ${PORT}`);
});
