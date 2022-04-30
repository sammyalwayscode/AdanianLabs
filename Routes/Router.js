const express = require("express");
const router = express.Router();
const {
  signUpUsers,
  getAllUsers,
  signInUser,
  getOneUsers,
} = require("../Controller/Controller");

router.route("/signup").post(signUpUsers);
router.route("/users").get(getAllUsers);
router.route("/signin").post(signInUser);
router.route("/users/:id").get(getOneUsers);

module.exports = router;
