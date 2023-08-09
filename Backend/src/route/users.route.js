const express = require("express");
const router = express.Router();
const {
  userSignupController,
  userLoginController,
  userLogoutController,
  userDetailsController,
} = require("../controller/user.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.get("/", authMiddleware, async (req, res) => {
  const { userID } = req.body;
  let data = await userDetailsController(userID);
  res.status(data.status).send(data.payload);
});

router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  // console.log(username, email, password);

  let data = await userSignupController(username, email, password);

  res.status(data.status).send(data.payload);
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  let data = await userLoginController(email, password);
  res.status(data.status).send(data.payload);
});

router.post("/logout", (req, res) => {
  const { token } = req.headers;
  let data = userLogoutController(token);
  res.status(data.status).send(data.payload);
});

module.exports = { router };
