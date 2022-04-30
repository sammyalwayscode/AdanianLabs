const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const usersModel = require("../Model/Model");
const { validateUsers, validateSignIn } = require("../Utils/ValidateUser");

const signUpUsers = async (req, res) => {
  try {
    //Validate User
    const { error } = validateUsers(req.body);
    if (error) {
      res.status(409).json({
        status: "Failed to Validate user",
        message: error.details[0].message,
      });
    } else {
      //Verify User to check if user exist before
      const oldUser = await usersModel.findOne({ email: req.body.email });
      if (oldUser) {
        res.json(`User Already Exist`);
      } else {
        //Then if userd dose not exist before it creates a new User

        //But it first of all salt the password to make the password unique and secured

        //Salt The Password
        const saltedPassword = await bcrypt.genSalt(10);
        //Hash the Password
        const hashedPasword = await bcrypt.hash(
          req.body.password,
          saltedPassword
        );

        //Create user Object
        const userData = {
          name: req.body.name,
          email: req.body.email,
          password: hashedPasword,
        };

        //Create User
        const user = await usersModel.create(userData);
        if (!user) {
          res.status(400).json({
            status: 400,
            message: "Failed to Create User",
          });
        } else {
          res.status(201).json({
            status: 201,
            message: "Email Dose Not Exist",
            data: user,
          });
        }
      }
    }
    //Catch Other Errors
  } catch (error) {
    res.json({ message: error.message });
  }
};

//Get All Users
const getAllUsers = async (req, res) => {
  try {
    const users = await usersModel.find();
    if (users.length < 1) {
      res.status(404).json({
        status: 404,
        message: "No User in DataBase",
      });
    } else {
      res.status(200).json({
        status: 200,
        totalUsers: users.length,
        data: users,
      });
    }
  } catch (error) {
    res.status(404).json({
      status: 404,
      message: error.message,
    });
  }
};
//Get One Users
const getOneUsers = async (req, res) => {
  try {
    const users = await usersModel.findById(req.params.id);
    if (users.length < 1) {
      res.status(404).json({
        status: 404,
        message: `Can't get User with ID: ${req.params.id} In Database`,
      });
    } else {
      res.status(200).json({
        status: 200,
        totalUsers: users.length,
        data: users,
      });
    }
  } catch (error) {
    res.status(404).json({
      status: 404,
      message: error.message,
    });
  }
};

//Sign In Users
const signInUser = async (req, res) => {
  try {
    //Validate Sign In

    const { error } = validateSignIn(req.body);
    if (error) {
      res.status(409).json({
        status: "Can't sign In User",
        message: error.details[0].message,
      });
    } else {
      //Check if the users email matches with the one in the database
      const user = await usersModel.findOne({ email: req.body.email });
      if (!user) {
        res.json({
          message: "User not Recognised",
        });
      } else {
        //If the user email matches then check if the password matches with the email provided
        const passwordCheck = await bcrypt.compare(
          req.body.password,
          user.password
        );
        if (!passwordCheck) {
          //If password does not matches then trow this error
          res.json({ message: "Invalid Password" });
        } else {
          //Then if Password matches Hide the passwore and Ecrypt the users Info
          const { password, ...info } = user._doc;
          const token = jwt.sign(
            //Payload or Data
            {
              id: user.id,
              name: user.name,
              email: user.email,
            },
            //Secrete
            "mytoken",
            //option

            //Set the time limit of when the token will expire which in this case is TWO Days

            //Then after this time if the user logsin back it generates a new token for the user

            { expiresIn: "2d" }
          );
          res.json({
            //Then if validation is sucessfull it logs in the USER
            message: `Welcome back ${user.name}`,
            data: { token, info },
          });
        }
      }
    }
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
};

module.exports = { signUpUsers, getAllUsers, signInUser, getOneUsers };
