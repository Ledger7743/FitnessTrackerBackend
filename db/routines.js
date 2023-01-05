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

    const {
      rows: [activity],
    } = await client.query(
      `
      SELECT *
      FROM activities
      JOIN routines ON activities.id=routine_tags.
      `
    );

    const { rows: activities } = await client.query(`
    SELECT * FROM activities
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

async function getAllPublicRoutines() {}

async function getAllRoutinesByUser({ username }) {}

async function getPublicRoutinesByUser({ username }) {}

async function getPublicRoutinesByActivity({ id }) {}

async function updateRoutine({ id, ...fields }) {}

async function destroyRoutine(id) {}

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
