const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: 0,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.todos = require("./todos.model.js")(sequelize, Sequelize);
db.images = require("./images.model.js")(sequelize, Sequelize);
// Todo ve Image arasında ilişki
db.todos.hasMany(db.images, { as: "images" });
db.images.belongsTo(db.todos, {
  foreignKey: "todoId",
  as: "todo",
});
module.exports = db;
