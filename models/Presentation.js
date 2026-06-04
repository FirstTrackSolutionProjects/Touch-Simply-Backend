'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class presentation extends Model {
    static associate(db) {
      // presentation.belongsTo(db.UserRole, {
      //   foreignKey: 'user_role_id',
      //   as: 'userRole',
      //   onDelete: 'CASCADE',
      //   onUpdate: 'CASCADE',
      // });

      // presentation.belongsTo(db.presentation, {
      //   foreignKey: 'parent_presentation_id',
      //   as: 'parentpresentation',
      //   onDelete: 'CASCADE',
      //   onUpdate: 'CASCADE',
      // });
      // presentation.hasMany(db.presentation, {
      //   foreignKey: 'parent_presentation_id',
      //   as: 'childpresentations',
      // });

      // presentation.hasMany(db.presentationPriceBreakup, {
      //   foreignKey: 'presentation_id',
      //   as: 'priceBreakups',
      //   onDelete: 'CASCADE',
      //   onUpdate: 'CASCADE',
      // });
      // presentation.hasMany(db.presentationRefund, {
      //   foreignKey: 'presentation_id',
      //   as: 'refunds',
      //   onDelete: 'CASCADE',
      //   onUpdate: 'CASCADE',
      // });
    }
  }

  presentation.init(
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
      modelName: 'presentation',
      tableName: 'presentations',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return presentation;
};
