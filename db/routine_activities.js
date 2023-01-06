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

// const setString = Object.keys(fields)
//   .map((key, index) => `"${key}"=$${index + 1}`)
//   .join(", ");
// console.log("these are my fields", fields);
// console.log("THIS IS MY SETSTRING:", setString);
// console.log("dependency array", Object.values(fields));

async function updateRoutineActivity({ id, ...fields }) {
  try {
    if (!fields.length) return;
    const {
      rows: [activity],
    } = await client.query(
      `
        UPDATE routine_activities
        SET count AND duration
        WHERE id=${id}
        RETURNING *;
        `,
      Object.values(fields)
    );

    console.log("this is the updated activity:", activity);
    return routine_activities;
  } catch (error) {
    throw error;
  }
}

// try {
//   if (fields.count) {
//     await client.query(
//       `
//     UPDATE routine_activity
//     SET count =
//     WHERE id=${1};
//     `,
//       [id]
//     );
//   }
//   if (fields.duration) {
//     `
//     UPDATE routine_activity
//     SET duration =
//     WHERE id=${1};
//     `[id];
//   }

//   return fields;
// } catch (error) {
//   throw error;
// }
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
