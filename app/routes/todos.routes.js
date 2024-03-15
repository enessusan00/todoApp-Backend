module.exports = (app) => {
  const todos = require("../controllers/todos.controller.js");
  var router = require("express").Router();
  const fs = require('fs');

  const uploadDir = './uploads';
  
  if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  
  const multer = require("multer");
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname);
    },
  });

  const upload = multer({ storage: storage });

  router.get("/:id/images", todos.getImages);

  router.post("/:id/upload", upload.array("images"), todos.uploadImages);
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

  // Delete all Tutorials with status done
  router.delete("/disables", todos.deleteAllDisables);

  // Delete a Tutorial with id
  router.delete("/:id", todos.delete);

  // Delete all Tutorials
  router.delete("/", todos.deleteAll);

  app.use("/api/todos", router);
};
