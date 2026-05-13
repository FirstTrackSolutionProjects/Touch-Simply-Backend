const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');
const User = require('./User');

const Portfolio = sequelize.define('Portfolio', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    data: {
        type: DataTypes.JSON,
        allowNull: false,
    },
    desc: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    template: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

User.hasMany(Portfolio);
Portfolio.belongsTo(User);

module.exports = Portfolio;