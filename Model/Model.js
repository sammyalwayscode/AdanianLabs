const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
//Creating A Schema Of Users
const usersSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    default: uuidv4,
  },
});

//Creating A Model
const usersModel = mongoose.model("AdrainUsers", usersSchema);
module.exports = usersModel;
