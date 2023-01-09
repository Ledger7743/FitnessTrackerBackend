/* eslint-disable no-useless-catch */
const express = require("express");
const usersRouter = express.Router();
const jwt = require("jsonwebtoken");
const { getUserByUsername, createUser, getUser } = require("../db");
const { JWT_SECRET } = process.env;
const { PasswordTooShortError, UserTakenError } = require("../errors");
const bcrypt = require("bcrypt");
const { requireUser } = require("./utils");

usersRouter.use((req, res, next) => {
  // console.log("A request is being made to /users");

  next();
});

// POST /api/users/register
usersRouter.post("/register", async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const _user = await getUserByUsername(username);
    // console.log(_user);
    if (_user) {
      next({
        name: "UserTakenError",
        message: UserTakenError(username),
      });
    }

    if (password.length < 8) {
      next({
        name: "PasswordNotLongEnough",
        message: PasswordTooShortError(),
      });
    } else {
      const user = await createUser({
        username,
        password,
      });

      const token = jwt.sign(
        {
          id: user.id,
          username,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1w",
        }
      );

      res.send({
        message: "thank you for signing up",
        token,
        user,
      });
    }
  } catch (error) {
    next(error);
  }
});
// POST /api/users/login
usersRouter.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    // request must have both username and password!!!
    if (!username || !password) {
      next({
        name: "MissingCredentialsError",
        message: "Please supply both a username and password",
      });
    }

    const user = await getUserByUsername(username);
    const hashedPassword = user.password;
    console.log(
      "THIS IS MY PASSWORD AND HASHED PASSWORD-------->",
      password,
      hashedPassword
    );
    const match = await bcrypt.compare(password, hashedPassword);
    console.log("user retrieved:", user);
    if (user && match) {
      // create token & return to user
      // maybe delete your password!
      delete user.password;
      const token = jwt.sign(user, JWT_SECRET, { expiresIn: "1h" });
      console.log("this is my token: ------> ", token);
      res.send({ message: "you're logged in!", token, user });
    } else {
      next({
        name: "IncorrectCredentialsError",
        message: "Username or password is incorrect",
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// GET /api/users/me
usersRouter.get("/me", requireUser, async (req, res, next) => {
  try {
    res.send(req.user);
  } catch (error) {
    next(error);
  }
});

// GET /api/users/:username/routines

module.exports = usersRouter;
