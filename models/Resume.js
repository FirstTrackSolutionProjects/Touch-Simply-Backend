const { DataTypes } = require("sequelize");

const sequelize = require("../config/config");

const Resume = sequelize.define("Resume", {
  title: {
    type: DataTypes.STRING,
  },

  image: {
    type: DataTypes.TEXT("long"),
  },

  data: {
    type: DataTypes.TEXT("long"),
  },

  desc: {
    type: DataTypes.STRING,
  },

  template: {
    type: DataTypes.STRING,
  },

  userId: {
    type: DataTypes.INTEGER,
  },
});

module.exports = Resume;