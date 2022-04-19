const properties = require('./json/properties.json');
const users = require('./json/users.json');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'serra',
  password: '123',    //obvs this will change before we push to prod
  host: 'localhost',
  database: 'lightbnb'
});


/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */

 const getUserWithEmail = function(email) {
  return pool
  .query(`SELECT * FROM users WHERE email=$1`, [email])
  .then((result) => { 
    return Promise.resolve(result.rows[0]);
  })
  .catch(error => console.log(error.message))
  // .catch((err) => { return null })
}

exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */

 const getUserWithId = function(id) {
  return pool
  .query(`SELECT * FROM users WHERE id=$1`, [id])
  .then((result) => { 
    console.log(result.rows[0]);
    return Promise.resolve(result.rows[0]);
  })
  .catch(error => console.log(error.message))
  // .catch((err) => { return null })
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */

const addUser = function(user) {

  const values = [user.name, user.email, user.password];
  const queryString = `INSERT INTO users (name, email, password)
  VALUES ($1, $2, $3)
  RETURNING *;`;
 
  return pool
  .query(queryString, values)
  .then((result) => {
    console.log(result.rows[0]);
    return Promise.resolve(result.rows[0]);
  })
  .catch(error => console.log(error.message))
}

exports.addUser = addUser;

const userObjA = {
  name: 'c',
  email: 'c@c.c',
  password: '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'
}


/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  return getAllProperties(null, 2);
}
exports.getAllReservations = getAllReservations;



/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */

/*reminder! 
* .then _always_ returns a promise and a promise is an _object_
* so even though result.rows is an array, .then returns it as part the the promise object
* we are using promises here bc other parts of the app (apiroutes) expect them
*/

const getAllProperties = (options, limit = 1) => {
  return pool
  .query(`SELECT * FROM properties LIMIT $1`, [limit])
  .then((result) => {
    return result.rows;
  })
  .catch(error => console.log(error.message))
}
exports.getAllProperties = getAllProperties;






















/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
}
exports.addProperty = addProperty;
