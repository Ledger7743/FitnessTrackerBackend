/* eslint-disable no-useless-catch */
const client = require("./client");
const bcrypt = require("bcrypt");
const saltRounds = 10;
// database functions

// user functions
async function createUser({ username, password }) {
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  console.log("THIS IS A USER PASSWORD------------>", password);
  console.log("this is my hashed password--------->", hashedPassword);

  try {
    const {
      rows: [user],
    } = await client.query(
      `
      INSERT INTO users( username, password)
      VALUES ($1, $2)
      ON CONFLICT (username) DO NOTHING
      RETURNING id, username;
      `,
      [username, hashedPassword]
    );

    console.log("This is a user ------------>", user);
    return user;
  } catch (error) {
    throw error;
  }
}

async function getUser({ username, password }) {
  const {
    rows: [user],
  } = await client.query(
    `
    SELECT * FROM users;
    `
  );
  //trenton added ^^^^^ deleted RETURNING password and got one to pass
  const hashedPassword = user.password;
  const match = await bcrypt.compare(password, hashedPassword);

  if (match) {
    return user;
  } else {
    delete user.password;
    return null;
  }
  //trenton added

  // ******** commented out ****** \\
  // if (user.password === password) {
  //   // if ($password == $row["password"])
  //   return users;
  // } else return null;
  // ******** commented out *******\\\
}

async function getUserById(userId) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
      SELECT id
      FROM users
      WHERE id=${userId};
      `
    );

    delete user.password;
    return user;
  } catch (error) {
    console.log(error);
  }
}

async function getUserByUsername(username) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
      SELECT *
      FROM users
      WHERE username=$1;
      `,
      [username]
    );

    return user;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
};
