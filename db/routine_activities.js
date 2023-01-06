/* eslint-disable no-useless-catch */
const client = require("./client");
const { getRoutineById } = require("./routines");

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
  try {
    const {
      rows: [routine_activities],
    } = await client.query(
      `
    INSERT INTO routine_activities("routineId", "activityId", count, duration)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT ("routineId", "activityId") DO NOTHING
    RETURNING *;
    `,
      [routineId, activityId, count, duration]
    );
    return routine_activities;
  } catch (error) {
    throw error;
  }
}

async function getRoutineActivityById(id) {
  try {
    const {
      rows: [routine_activities],
    } = await client.query(
      `
    SELECT *
    FROM routine_activities
    WHERE id =$1
    `,
      [id]
    );

    return routine_activities;
  } catch (error) {
    console.log("ERROR IN GETROUTINEACTIVITYBYID");
  }
}

async function getRoutineActivitiesByRoutine({ id }) {}

async function updateRoutineActivity({ id, ...fields }) {}

async function destroyRoutineActivity(id) {
  try {
    const {
      rows: [routine_activities],
    } = await client.query(`
    DELETE FROM routine_activities
    WHERE id =${id}
    RETURNING *;
  `);

    return routine_activities;
  } catch (error) {
    throw error;
  }
}

async function canEditRoutineActivity(routineActivityId, userId) {}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
