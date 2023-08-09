const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const userModel = require("../model/users.model");
require("dotenv").config();

// secret key
const secretKey = process.env.SECRET_KEY;

// backlist
const backlist = [];

async function userDetailsController(userid) {
  try {
    const user = await userModel.findById(userid);
    if (!user) {
      return {
        status: 400,
        payload: { msg: "Please Check User Credentials" },
      };
    }
    return {
      status: 200,
      payload: { msg: "Succefully get details", email: user.email },
    };
  } catch (error) {
    return {
      status: 401,
      payload: { msg: error.message },
    };
  }
}

// used hash in our signup router
async function userSignupController(username, email, password) {
  // hash
  const hash = await argon2.hash(password);

  try {
    const user = await userModel.create({ username, email, password: hash });

    return {
      status: 201,
      payload: { msg: "User Signup Successfuly" },
    };
  } catch (error) {
    return {
      status: 403,
      payload: { msg: error.message },
    };
  }
}

async function userLoginController(email, password) {
  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return {
        status: 401,
        payload: { msg: "Please Enter valid email id" },
      };
    }

    if (user.blockedUntil > new Date()) {
      return {
        status: 403,
        payload: {
          msg: "Account is blocked for 24 hours because you try to login with wrong credentials more than limits",
        },
      };
    }

    // Check password and update login attempts
    // Logic to compare password and update attempts here

    const hashPassword = user.password;

    const check = await argon2.verify(hashPassword, password);

    if (check) {
      const token = jwt.sign({ id: user._id, email: user.email }, secretKey, { expiresIn: "7d" });
      return {
        status: 201,
        payload: { msg: "Login Successfully", token },
      };
    } else {
      if (user.loginAttempts >= 5) {
        const blockDuration = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
        user.blockedUntil = new Date(Date.now() + blockDuration);
        await user.save();
        return {
          status: 403,
          payload: {
            msg: "Account is blocked for 24 hours because you try to login with wrong password more than limits",
          },
        };
      }
      user.loginAttempts++;
      await user.save();
      return {
        status: 401,
        payload: { msg: "Wrong Password" },
      };
    }
  } catch (error) {
    return {
      status: 401,
      payload: { msg: error.message },
    };
  }
}

function userLogoutController(token) {
  if (!token) {
    return {
      status: 404,
      payload: { msg: "Token Not Found" },
    };
  }
  backlist.push(token);

  return {
    status: 201,
    payload: { msg: "Logout Successfull" },
  };
}

module.exports = { userSignupController, userLoginController, userLogoutController, userDetailsController };
