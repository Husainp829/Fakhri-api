const mysql = require("mysql");
const squel = require("squel");

const squelMySql = squel.useFlavour("mysql");

const db = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  connectionLimit: process.env.DB_MAX,
};

// this initializes a connection pool
const pool = mysql.createPool(db);

/**
 * Execute a query and returns a bluebird Promise
 * @param {*} text
 * @param {*} values
 */
function query(text, values) {
  return new Promise((resolve, reject) => pool.query(text, values, (error, results) => {
    if (error) {
      reject(error);
    } else {
      resolve(results);
    }
  }));
}

/**
 * Execute a query and return first elements
 * @param {*} text
 * @param {*} values
 */
function queryUnique(text, values) {
  return query(text, values).then((rows) => {
    if (rows.length === 0) return null;
    return rows[0];
  });
}
/**
 * Execute a query and return All elements
 * @param {*} text
 * @param {*} values
 */
function queryUniqueAll(text, values) {
  return query(text, values).then((rows) => {
    if (rows.length === 0) return null;
    return rows;
  });
}

/**
 * Helper function to insert one or many elements
 */

function insert(tableName, values) {
  let request;
  if (values instanceof Array) {
    if (values.length === 0) return null;
    request = squelMySql.insert().into(tableName).setFieldsRows(values).toParam();
  } else {
    request = squelMySql.insert().into(tableName).setFields(values).toParam();
  }

  return query(request.text, request.values).then((data) => ({
    id: data.insertId,
    ...values,
  }));
}

/**
 * Update rows in DB
 * @param {*} tableName
 * @param {*} condition
 * @param {*} values
 */
function update(tableName, condition, values) {
  const request = squelMySql.update().table(tableName).setFields(values);

  for (let i = 0; i <= condition.length - 2; i += 2) {
    request.where(condition[i], condition[i + 1]);
  }
  return query(request.toString()).then(() => values);
}

/**
 * Update one row, and return NOT FOUND if no row
 * was updated
 */
function updateOne(tableName, condition, values) {
  return update(tableName, condition, values);
}

/**
 * Delete rows in DB
 * @param {*} tableName
 * @param {*} condition
 */
function remove(tableName, condition) {
  const request = squelMySql.delete().from(tableName);
  for (let i = 0; i <= condition.length - 2; i += 2) {
    request.where(condition[i], condition[i + 1]);
  }
  const result = query(request.toString());
  return result;
}

/**
 * Delete one row, and return NOT FOUND if no row
 * was updated
 */
function removeById(tableName, condition) {
  return remove(tableName, condition).then((rows) => {
    if (rows.length === 0) return null;
    return rows[0];
  });
}

module.exports = {
  query,
  queryUnique,
  insert,
  update,
  updateOne,
  queryUniqueAll,
  remove,
  removeById,
};
