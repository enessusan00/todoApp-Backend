module.exports = (sequelize, Sequelize) => {
  const Todo = sequelize.define("todo", {
    title: {
      type: Sequelize.STRING
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
  },
  {
    timestamps: true
  });

  return Todo;
};
