module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        username: {
            type: Sequelize.STRING,
            unique: true,
        },
        email: {
            type: Sequelize.STRING,
            unique: true,
        },
        password: {
            type: Sequelize.STRING,
        },
        role: {
            type: Sequelize.ENUM('admin', 'user'),
            defaultValue: 'user'
        },
    });

    return User;
};