const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { json } = require("express");
const { error, success } = require("../utils/responseWrapper");

const signupController = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password || !name) {
      // return res.status(401).send("All fields are required");
      return res.send(error(401, "All fields are required."));
    }

    const oldUser = await User.findOne({ email });

    if (oldUser) {
      // return res.status(409).send("User already exist");
      return res.send(error(409, "User already exist."));
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashPassword,
    });

    // return res.status(201).json({ user });
    return res.send(success(201, "user created successfully"));
  } catch (err) {
    return res.send(error(500, err.message));
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      // return res.status(401).send("All fields are required");
      return res.send(error(401, "All fields are required."));
    }
    console.log("Before call");
    const oldUser = await User.findOne({ email }).select("+password");

    /* .select(
      "+password"
      )*/
    console.log("After call");
    if (!oldUser) {
      // return res.status(404).send("User not registered");
      return res.send(error(404, "User not registered."));
    }
    const matched = await bcrypt.compare(password, oldUser.password);
    if (!matched) {
      // return res.status(403).send("Incorrect Password");
      return res.send(error(403, "Incorrect Password."));
    }

    // return res.json({ oldUser });
    const accessToken = generateAccessToken({
      _id: oldUser._id,
    });
    const refreshToken = generateRefreshToken({
      _id: oldUser._id,
    });

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
    });

    // return res.json({ accesstoken: accessToken });
    return res.send(success(200, { accessToken }));
  } catch (err) {
    return res.send(error(500, err.message));
  }
};

//this will check the refreshToken validity and generate a new access token
const refreshAccessTokenController = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies.jwt) {
    // return res.status(401).send("Refresh token in cookie is required");
    return res.send(error(401, "Refresh token in cookie is required"));
  }

  const refreshToken = cookies.jwt;
  // console.log("Refresh Token:", refreshToken);

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_PRIVATE_KEY
    );

    const _id = decoded._id;
    const accessToken = generateAccessToken({ _id });

    // return res.status(201).json({ accessToken });
    return res.send(success(201, { accessToken }));
  } catch (err) {
    console.log(err);
    // return res.status(401).send("Invalid refresh token");
    return res.send(error(401, "Invalid refresh token"));
  }
};

const logoutController = async (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: true,
    });
    return res.send(success(200, "User logged out"));
  } catch (err) {
    return res.send(error(500, err.message));
  }
};

//internal function

const generateAccessToken = (data) => {
  try {
    const token = jwt.sign(data, process.env.ACCESS_TOKEN_PRIVATE_KEY, {
      expiresIn: "1d",
    });
    return token;
  } catch (error) {
    console.log(error);
  }
};

const generateRefreshToken = (data) => {
  try {
    const token = jwt.sign(data, process.env.REFRESH_TOKEN_PRIVATE_KEY, {
      expiresIn: "1y",
    });
    return token;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  signupController,
  loginController,
  refreshAccessTokenController,
  logoutController,
};
