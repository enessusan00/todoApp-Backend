module.exports = app => {
  const todos = require("../controllers/todos.controller.js");

  var router = require("express").Router();

  // Create a new Tutorial
  router.post("/", todos.create);

  // Retrieve all Tutorials
  router.get("/", todos.findAll);

  // Retrieve all published Tutorials
  router.get("/done", todos.findAllDone);

  // Retrieve a single Tutorial with id
  router.get("/:id", todos.findOne);

  // Update a Tutorial with id
  router.put("/:id", todos.update);

  // Delete a Tutorial with id
  router.delete("/:id", todos.delete);

  // Delete all Tutorials
  router.delete("/", todos.deleteAll);

  app.use('/api/todos', router);
};
