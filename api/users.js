/* eslint-disable no-useless-catch */
const express = require("express");
const usersRouter = express.Router();
const jwt = require("jsonwebtoken");
const { getUser, getUserByUsername, createUser } = require("../db");
const { JWT_SECRET } = process.env;

usersRouter.use((req, res, next) => {
  console.log("A request is being made to /users");

  res.send({ message: "hello from /users ahhhhh!!!" });
  next();
});

usersRouter.get("/", async (req, res) => {
  const users = await getUser();

  res.send({
    users,
  });
});

// POST /api/users/register
usersRouter.post("/register", async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const _user = await getUserByUsername(username);
    if (_user) {
      next({
        name: "UserExistsError",
        message: "A user by that username already exists",
      });
    }

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
    });
  } catch ({ name, message }) {
    next({ name, message });
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
    console.log("user retrieved:", user);
    if (user && user.password == password) {
      // create token & return to user
      // maybe delete your password!
      const token = jwt.sign(user, JWT_SECRET);
      delete user.password;
      res.send({ message: "you're logged in!", token });
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

// GET /api/users/:username/routines

module.exports = usersRouter;
