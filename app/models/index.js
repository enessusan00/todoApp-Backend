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

db.user = require("./user.model.js")(sequelize, Sequelize);
db.images = require("./images.model.js")(sequelize, Sequelize);
db.todos = require("./todos.model.js")(sequelize, Sequelize);

db.user.hasMany(db.todos, { foreignKey: "userId",as: "todos" });
// Todo ve Image arasında ilişki
db.todos.belongsTo(db.user, {
  foreignKey: "userId",
  as: "user",
});
db.todos.hasMany(db.images, { foreignKey: "todoId",as: "images" });
db.images.belongsTo(db.todos, {
  foreignKey: "todoId",
  as: "todo",
});
// Todo ve User arasında ilişki


module.exports = db;
