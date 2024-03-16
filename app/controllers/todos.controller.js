const db = require("../models");
const Todo = require('../models/todos.model')(db.sequelize, db.Sequelize);
const multer = require('multer');
const Op = db.Sequelize.Op;
const Image = db.images; // Image modelini kullanıma al


exports.deleteImage = (req, res) => {
  const id = req.params.id;

  Image.findByPk(id)
    .then(image => {
      if (image) {
        // Dosya sisteminden görseli sil
        const fs = require('fs');
        fs.unlink(image.imagePath, (err) => {
          if (err) {
            console.error("Error deleting image:", err);
          }
        });

        // Veritabanından görseli sil
        image.destroy();
        res.send({
          message: "Image was deleted successfully."
        });
      }
      else {
        res.status(404).send({
          message: `Cannot find image with id=${id}.`
        });
      }
    }
    )
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving image with id=" + id
      });
    });
};



exports.getImages = (req, res) => {
  const todoId = req.params.id;

  // Image modelini kullanarak, belirli bir Todo'ya ait görselleri sorgulayın
  Image.findAll({
    where: {
      todoId: todoId
    }
  })
  .then(images => {
    // Görselleri JSON formatında döndür
    res.send(images);
  })
  .catch(err => {
    res.status(500).send({
      message: "Some error occurred while retrieving images."
    });
  });
};



exports.uploadImages = (req, res) => {
  const todoId = req.params.id; // URL parametresinden Todo ID'sini al

  // Eğer dosya yüklendiyse
  if (req.files && req.files.length > 0) {
    // Yüklenen her dosya için bir döngü başlat
    req.files.forEach(file => {
      // Her dosya için Image modelini kullanarak bir kayıt oluştur
      console.log("file", file);
      console.log("file.path", file.path);
      console.log("todoId", todoId);
      Image.create({
        todoId: todoId, // İlişkili Todo'nun ID'si
        imagePath: file.path // Yüklenen dosyanın kaydedildiği yol
      })
      .then(image => {
        console.log("Image saved successfully:", image);
      })
      .catch(err => {
        console.error("Error saving image:", err);
        // Kayıt sırasında bir hata oluşursa, 500 hatası dön
        res.status(500).send({
          message: "An error occurred while saving the image."
        });
        return;
      });
    });

    // Tüm görseller başarıyla kaydedildiyse, bir yanıt gönder
    res.send({ message: "Images uploaded successfully!" });
  } else {
    // Eğer dosya yüklenmediyse, bir hata mesajı gönder
    res.status(400).send({ message: "Please upload images." });
  }
};

// Create and Save a new Todo
exports.create = (req, res) => {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a Todo
  const todo = {
    title: req.body.title,
    description: req.body.description,
    status: req.body.status
  };

  // Save Todo in the database
  Todo.create(todo)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the todo."
      });
    });
};

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
  const title = req.query.title;
  var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;

  Todo.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving todo."
      });
    });
};

// Find a single Todo with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Todo.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find todo with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving todo with id=" + id
      });
    });
};

// Update a Todo by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Todo.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Todo was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update todo with id=${id}. Maybe todo was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating todo with id=" + id
      });
    });
};

// Delete a Todo with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Todo.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "todo was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete todo with id=${id}. Maybe Tutorial was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete todo with id=" + id
      });
    });
};

// Delete all Todo from the database.
exports.deleteAll = (req, res) => {
  Todo.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Todo were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Todo."
      });
    });
};

// find all published Tutorial
exports.findAllDone= (req, res) => {
  Todo.findAll({ where: { status: "done" }})
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Todo."
      });
    });
};

exports.deleteAllDisables = (req, res) => {
  Todo.destroy({
    where: { active: false },
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Todo were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Todo."
      });
    });
}
