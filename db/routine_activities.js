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

async function getRoutineActivitiesByRoutine({ id }) {
  try {
    const { rows: routine_activities } = await client.query(
      `
    SELECT *
    FROM routine_activities
    WHERE "routineId" = $1
    `,
      [id]
    );
    return routine_activities;
  } catch (error) {
    throw error;
  }
}

async function updateRoutineActivity({ id, ...fields }) {
  //fields are variables that hold the information
  // these are my fields { count: 79374, duration: 9191 }
  //THIS IS MY SETSTRING: "count"=$1, "duration"=$2
  // dependency array [ 79374, 9191 ]
  try {
    const setString = Object.keys(fields)
      .map((key, index) => `"${key}"=$${index + 1}`)
      .join(", ");

    // console.log("these are my fields", fields);
    // console.log("THIS IS MY SETSTRING:", setString);
    // console.log("dependency array", Object.values(fields));
    if (!setString.length) return;
    const {
      rows: [routine_activities],
    } = await client.query(
      `
        UPDATE routine_activities
        SET ${setString}
        WHERE id=${id}
        RETURNING *;
        `,
      Object.values(fields)
    );

    // console.log("this is the updated activity:", activity);
    return routine_activities;
  } catch (error) {
    throw error;
  }
}

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

async function canEditRoutineActivity(routineActivityId, userId) {
  console.log("thiss is my userId:", userId);
  console.log("thiss is my routineactivityid:", routineActivityId);
  if (routineActivityId === userId) return true;

  // join users and routine activity
  try {
    const {
      rows: [routine_activities],
    } = await client.query(
      `
      SELECT routines.*
      FROM routine_activities
      JOIN routines ON routines.id = routine_activities."routineId"
      WHERE routines."creatorId" = $2 AND routine_activities.id = $1
      `,
      [routineActivityId, userId]
    );
    return routine_activities;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
