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
  const queryString = `SELECT * FROM users WHERE email=$1`;

  return pool.query(queryString, [email.toLowerCase()])
    .then(res => res.rows[0]);
};

exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */

const getUserWithId = function(id) {
  const queryString = `SELECT * FROM users WHERE id=$1`;

  return pool.query(queryString, [id])
    .then(result => result.rows[0]);
};

exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */

const addUser = function(user) {

  const values = [user.name.toLowerCase(), user.email.toLowerCase(), user.password];
  const queryString = `INSERT INTO users (name, email, password)
  VALUES ($1, $2, $3)
  RETURNING *;`;
 
  return pool.query(queryString, values)
    .then(result => result.rows[0]);
};

exports.addUser = addUser;



/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */

const getAllReservations = function(guest_id, limit = 10) {

  const queryString = `
  SELECT
  reservations.*,
  properties.*,
  avg(property_reviews.rating) AS average_rating
  FROM property_reviews 
  JOIN reservations ON property_reviews.reservation_id = reservations.id
  JOIN properties ON property_reviews.property_id = properties.id
  WHERE 
    reservations.guest_id = $1 AND
    reservations.end_date < now()::date
  GROUP BY reservations.id, properties.id
  ORDER BY reservations.start_date ASC
  LIMIT $2;
  `;

  return pool.query(queryString, [guest_id, limit])
    .then(result => result.rows);
};

exports.getAllReservations = getAllReservations;



/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */

const getAllProperties = (options, limit = 2) => {

  const queryParams = [];

  let queryString = `
  SELECT properties.*, 
  avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  WHERE true
  `;

  if (options.owner_id) {
    queryParams.push(options.owner_id);
    queryString += `AND owner_id = $${queryParams.length} `;
  }

  if (options.city) {
    queryParams.push(`%${options.city.toUpperCase()}%`);
    queryString += `AND upper(city) LIKE $${queryParams.length} `;
  }

  if (options.minimum_price_per_night) {
    queryParams.push(options.minimum_price_per_night * 100);
    queryString += `AND cost_per_night >= $${queryParams.length} `;
  }

  if (options.minimum_price_per_night) {
    queryParams.push(options.minimum_price_per_night * 100);
    queryString += `AND cost_per_night >= $${queryParams.length} `;
  }

  if (options.maximum_price_per_night) {
    queryParams.push(options.maximum_price_per_night * 100);
    queryString += `AND cost_per_night <= $${queryParams.length} `;
  }

  if (options.minimum_rating) {
    queryParams.push(options.minimum_rating);
    queryString += `AND rating >= $${queryParams.length} `;
  }

  queryParams.push(limit);
  queryString += `
  GROUP BY properties.id
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  return pool
    .query(queryString, queryParams)
    .then(result => result.rows);
};

exports.getAllProperties = getAllProperties;



/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */

const addProperty = function(property) {
  const values = [property.owner_id, property.title.toLowerCase(), property.description, property.thumbnail_photo_url,
    property.cover_photo_url, property.cost_per_night, property.street.toLowerCase(), property.city.toLowerCase(),
    property.province.toLowerCase(), property.post_code, property.country.toLowerCase(), property.parking_spaces,
    property.number_of_bathrooms, property.number_of_bedrooms ];

  const queryString = `INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, 
    cost_per_night, street, city, province, post_code, country, parking_spaces, number_of_bathrooms, number_of_bedrooms)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    RETURNING *;`;

  return pool.query(queryString, values)
    .then(result => result.rows);
};

exports.addProperty = addProperty;
