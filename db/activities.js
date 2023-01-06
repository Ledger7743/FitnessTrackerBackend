/* eslint-disable no-useless-catch */
const client = require("./client");

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
  const routinesToReturn = [...routines];

  try {
    const { rows: activities } = await client.query(`
        SELECT activities.*, routine_activities.id 
        AS "routineActivityId", routine_activities."routineId", routine_activities.
        duration, routine_activities.count
        FROM activities
        JOIN routine_activities ON routine_activities."activityId" = activities.id;
      `);

    for (const routine of routinesToReturn) {
      const activitiesToAdd = activities.filter(
        (activity) => activity.routineId === routine.id
      );

      routine.activities = activitiesToAdd;
    }

    return routinesToReturn;
  } catch (error) {
    throw error;
  }
}

async function updateActivity({ id, ...fields }) {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");
  // console.log("these are my fields", fields);
  // console.log("THIS IS MY SETSTRING:", setString);
  // console.log("dependency array", Object.values(fields));
  try {
    if (!setString.length) return;
    const {
      rows: [activity],
    } = await client.query(
      `
        UPDATE activities
        SET ${setString}
        WHERE id=${id}
        RETURNING *;
        `,
      Object.values(fields)
    );

    console.log("this is the updated activity:", activity);
    return activity;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  attachActivitiesToRoutines,
  createActivity,
  updateActivity,
};
