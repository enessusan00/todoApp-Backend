module.exports = (sequelize, Sequelize) => {
    const Image = sequelize.define("image", {
      todoId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'todo',
          key: 'id'
        }
      },
      imagePath: {
        type: Sequelize.STRING,
        allowNull: false
      }
    });
  
    return Image;
  };
  