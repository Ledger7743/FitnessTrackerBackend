/* eslint-disable no-useless-catch */
// const { createFakeUserWithRoutinesAndActivities } = require("../tests/helpers");
const client = require("./client");

async function createRoutine({ creatorId, isPublic, name, goal }) {
  try {
    const {
      rows: [routines],
    } = await client.query(
      `
      INSERT INTO routines("creatorId", "isPublic", name, goal)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
      `,
      [creatorId, isPublic, name, goal]
    );
    return routines;
  } catch (error) {
    throw error;
  }
}

async function getRoutineById(id) {}

async function getRoutinesWithoutActivities() {
  try {
    const { rows: routines } = await client.query(
      `
      SELECT *
      FROM routines;
    `
    );

    return routines;
  } catch (error) {
    throw error;
  }
}

async function getAllRoutines() {
  try {
    const { rows: routines } = await client.query(
      `
    SELECT * 
    FROM routines
    `
    );

    // includes "their" activities - I don't think we need to add all activities, but the ones the user selects
    // const {
    //   rows: [userActivities],
    // } = await client.query(
    //   `
    //   INSERT INTO routines
    //   FROM activities
    //   RETURNING *;
    //   `,
    //   [userActivities]
    // );

    // const {
    //   rows: [userActivities],
    // } = await client.query(
    //   `
    //   INSERT INTO routines (duration, count, "routineId")
    //   FROM routine_activities
    //   RETURNING *;
    //   `,
    //   [userActivities]
    // );

    // const {
    //   rows: [creatorName],
    // } = await client.query(
    //   `
    //   SELECT username
    //   FROM users;
    //   `,
    //   [creatorName]
    // );

    const { rows: activities } = await client.query(`
    
    SELECT * 
    FROM activities
    JOIN routine_activities ON routine_activities."activityId" = activities.id
    `);

    for (const routine of routines) {
      const activitiesToAdd = activities.filter(
        (activity) => activity.routineId === routine.id
      );

      routine.activities = activitiesToAdd;
    }
    console.log("THESE ARE MY ROUTINES: --------------->", routines);
    return routines;
  } catch (error) {
    throw error;
  }
}

async function getAllPublicRoutines() {
  // try {
  //   const { rows: routines } = await client.query(
  //     `
  //   SELECT *
  //   FROM routines
  //   `
  //   );
}

async function getAllRoutinesByUser({ username }) {}

async function getPublicRoutinesByUser({ username }) {}

async function getPublicRoutinesByActivity({ id }) {}

async function updateRoutine({ id, ...fields }) {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");
  console.log("these are my fields", fields);
  console.log("THIS IS MY SETSTRING:", setString);
  // console.log("dependency array", Object.values(fields));
  try {
    if (!setString.length) return;
    const {
      rows: [routine],
    } = await client.query(
      `
        UPDATE routines
        SET ${setString}
        WHERE id=${id}
        RETURNING *;
        `,
      Object.values(fields)
    );

    console.log("this is the updated routine:", routine);
    return routine;
  } catch (error) {
    throw error;
  }
}

async function destroyRoutine(id) {
  try {
    await client.query(
      `
      DELETE FROM routine_activities
      WHERE "routineId" = $1
      `,
      [id]
    );

    //needs to delete all the routine_activities who routine is the one being deleted.
    await client.query(
      `
      DELETE FROM routines
      WHERE id = $1
      `,
      [id]
    );
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
};
