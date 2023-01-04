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
      RETURNING name, description;
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
    const { rows: id } = await client.query(
      `
      SELECT *
      FROM activities
      `
    );
    activities = await Promise.all(
      id.map((activities) => getActivityById(activity.id))
    );
    return;
  } catch (error) {
    throw error;
  }
}

async function getActivityById(id) {}

async function getActivityByName(name) {}

async function attachActivitiesToRoutines(routines) {
  // select and return an array of all activities
}

async function updateActivity({ id, ...fields }) {
  // don't try to update the id
  // do update the name and description
  // return the updated activity
}

module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  attachActivitiesToRoutines,
  createActivity,
  updateActivity,
};
