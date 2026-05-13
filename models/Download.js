const { DataTypes } = require("sequelize");
const sequelize = require("../config/config");
const User = require("./User");

const Download = sequelize.define("Download", {
  type: {
    type: DataTypes.STRING,
  },

  fileUrl: {
    type: DataTypes.STRING,
  },
});

User.hasMany(Download);
Download.belongsTo(User);

module.exports = Download;