'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(db) {
      // User.belongsTo(db.UserRole, {
      //   foreignKey: 'user_role_id',
      //   as: 'userRole',
      //   onDelete: 'CASCADE',
      //   onUpdate: 'CASCADE',
      // });

      // User.belongsTo(db.User, {
      //   foreignKey: 'parent_User_id',
      //   as: 'parentUser',
      //   onDelete: 'CASCADE',
      //   onUpdate: 'CASCADE',
      // });
      // User.hasMany(db.User, {
      //   foreignKey: 'parent_User_id',
      //   as: 'childUsers',
      // });

      // User.hasMany(db.UserPriceBreakup, {
      //   foreignKey: 'User_id',
      //   as: 'priceBreakups',
      //   onDelete: 'CASCADE',
      //   onUpdate: 'CASCADE',
      // });
      // User.hasMany(db.UserRefund, {
      //   foreignKey: 'User_id',
      //   as: 'refunds',
      //   onDelete: 'CASCADE',
      //   onUpdate: 'CASCADE',
      // });
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM("user", "admin"),
        allowNull: false,
      },
      isBlocked: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      timestamps: true,
    }
  );

  return User;
};
