module.exports = (app) => {
  const express = require('express');
  const todos = require("../controllers/todos.controller.js");
  var router = require("express").Router();
  const fs = require('fs');
  const {verifyToken} =  require("../controllers/user.controller");
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

  router.delete("/deleteImage/:id",verifyToken, todos.deleteImage);

  router.get("/:id/images", verifyToken,todos.getImages);

  router.post("/:id/upload",verifyToken, upload.array("images"), todos.uploadImages);
  // Create a new Tutorial
  router.post("/",verifyToken, todos.create);

  // Retrieve all Tutorials
  router.get("/:userId/user",verifyToken, todos.getUserTodos);

  // Retrieve all published Tutorials
  router.get("/done",verifyToken, todos.findAllDone);

  // Retrieve a single Tutorial with id
  router.get("/:id", verifyToken,todos.findOne);


  // Update a Tutorial with id
  router.put("/:id",verifyToken, todos.update);

  // Delete all Tutorials with status done
  router.delete("/disables",verifyToken, todos.deleteAllDisables);

  // Delete a Tutorial with id
  router.delete("/:id",verifyToken,todos.delete);

  // Delete all Tutorials
  router.delete("/",verifyToken, todos.deleteAll);

  app.use("/uploads", express.static("uploads"));

  app.use("/api/todos", router);
};
