/* eslint-disable no-useless-catch */
const client = require("./client");
const { getRoutineActivityById } = require("./routine_activities");

// database functions
async function createActivity({ name, description }) {
  // return the new activity
  try {
    const {
      rows: [activities],
    } = await client.query(
      `
      INSERT INTO activities(name, description)
      VALUES ($1, $2)
      RETURNING *;
      `,
      [name, description]
    );
    return activities;
  } catch (error) {
    throw error;
  }
}

async function getAllActivities() {
  // select and return an array of all activities
  try {
    const { rows: activities } = await client.query(
      `
      SELECT *
      FROM activities;
      `
    );
    // console.log(activities);
    return activities;
  } catch (error) {
    throw error;
  }
}

async function getActivityById(id) {
  try {
    const {
      rows: [activity],
    } = await client.query(
      `
      SELECT * 
      FROM activities
      WHERE id=$1;
      `,
      [id]
    );
    return activity;
  } catch (error) {
    throw error;
  }
}

async function getActivityByName(name) {
  try {
    const {
      rows: [activity],
    } = await client.query(
      `
      SELECT * 
      FROM activities
      WHERE name=$1;
      `,
      [name]
    );
    return activity;
  } catch (error) {
    throw error;
  }
}

async function attachActivitiesToRoutines(routines) {
  // select and return an array of all activities
}

async function updateActivity(fields = { id, name, description }) {
  // const { activity } = fields;
  // const setString = Object.keys(fields)
  //   .map((key, index) => `"${key}"=$${index + 1}`)
  //   .join(", ");
  // try {
  //   if (setString.length > 0) {
  //     await client.query(
  //       `
  //       UPDATE activities
  //       SET ${setString}
  //       WHERE name={$2}, description={$3}
  //       RETURNING *;
  //       `,
  //       Object.values(fields)
  //     );
  //   }
  //   console.log("this is the updated activity:", activity);
  //   return activity;
  // } catch (error) {
  //   throw error;
  // }
}

module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  attachActivitiesToRoutines,
  createActivity,
  updateActivity,
};
