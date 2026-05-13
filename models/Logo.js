const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');
const User = require('./User');

const Logo = sequelize.define('Logo', {
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
    template: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

User.hasMany(Logo);
Logo.belongsTo(User);

module.exports = Logo;