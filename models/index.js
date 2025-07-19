/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");

const basename = path.basename(__filename);
const db = {};
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: "mysql",
  port: Number(process.env.DB_PORT),
  pool: {
    max: parseInt(process.env.DB_MAX, 10) || 10, // max connections in pool
    min: 2, // keep at least 2 warm connections
    acquire: 30000, // max time (ms) to get a connection before throwing error
    idle: 10000, // remove idle connection after this (ms)
    evict: 10000, // time after which idle connections are evicted
  },
  dialectOptions: {
    bigNumberStrings: true,
  },
  benchmark: process.env.NODE_ENV === "development", // shows query timings in logs
  // eslint-disable-next-line no-console
  logging: process.env.NODE_ENV === "development" ? console.log : false, // logs queries
});

fs.readdirSync(__dirname)
  .filter((file) => file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js")
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
