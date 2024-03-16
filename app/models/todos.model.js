module.exports = (sequelize, Sequelize) => {
  const Todo = sequelize.define("todo", {
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.STRING
    },
    active: {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    }, 
    status: {
      type: Sequelize.ENUM('on going', 'in progress', 'done')
    },
    userId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'users', // 'users' tablosuna referans
        key: 'id',
      }
    }
  },
  {
    timestamps: true
  });

  return Todo;
};
