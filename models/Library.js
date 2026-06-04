'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Library extends Model {
    static associate(db) {
      Library.belongsTo(db.User, {
        foreignKey: 'user_id',
        as: 'user',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }

  Library.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      itemType: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },

      itemId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      fileUrl: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },

      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Library',
      tableName: 'libraries',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return Library;
};