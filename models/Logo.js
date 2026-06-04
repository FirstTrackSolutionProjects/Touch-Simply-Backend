// const { DataTypes } = require("sequelize");

// const sequelize = require("../config/database");

// const Logo = sequelize.define("Logo", {
//   id: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true,
//   },

//   title: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },

//   image: {
//     type: DataTypes.STRING,
//   },

//   template: {
//     type: DataTypes.STRING,
//   },

//   UserId: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//   },
// });

// module.exports = Logo;


'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Logo extends Model {
    static associate(db) {
      // Logo.belongsTo(db.UserRole, {
      //   foreignKey: 'user_role_id',
      //   as: 'userRole',
      //   onDelete: 'CASCADE',
      //   onUpdate: 'CASCADE',
      // });

      // Logo.belongsTo(db.Logo, {
      //   foreignKey: 'parent_Logo_id',
      //   as: 'parentLogo',
      //   onDelete: 'CASCADE',
      //   onUpdate: 'CASCADE',
      // });
      // Logo.hasMany(db.Logo, {
      //   foreignKey: 'parent_Logo_id',
      //   as: 'childLogos',
      // });

      // Logo.hasMany(db.LogoPriceBreakup, {
      //   foreignKey: 'Logo_id',
      //   as: 'priceBreakups',
      //   onDelete: 'CASCADE',
      //   onUpdate: 'CASCADE',
      // });
      // Logo.hasMany(db.LogoRefund, {
      //   foreignKey: 'Logo_id',
      //   as: 'refunds',
      //   onDelete: 'CASCADE',
      //   onUpdate: 'CASCADE',
      // });
    }
  }

  Logo.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      template: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      
    },
    {
      sequelize,
      modelName: 'Logo',
      tableName: 'logos',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return Logo;
};
