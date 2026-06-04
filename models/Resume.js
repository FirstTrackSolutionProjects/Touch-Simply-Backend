'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Resume extends Model {
    static associate(db) {
      // Resume.belongsTo(db.UserRole, {
      //   foreignKey: 'user_role_id',
      //   as: 'userRole',
      //   onDelete: 'CASCADE',
      //   onUpdate: 'CASCADE',
      // });

      // Resume.belongsTo(db.Resume, {
      //   foreignKey: 'parent_Resume_id',
      //   as: 'parentResume',
      //   onDelete: 'CASCADE',
      //   onUpdate: 'CASCADE',
      // });
      // Resume.hasMany(db.Resume, {
      //   foreignKey: 'parent_Resume_id',
      //   as: 'childResumes',
      // });

      // Resume.hasMany(db.ResumePriceBreakup, {
      //   foreignKey: 'Resume_id',
      //   as: 'priceBreakups',
      //   onDelete: 'CASCADE',
      //   onUpdate: 'CASCADE',
      // });
      // Resume.hasMany(db.ResumeRefund, {
      //   foreignKey: 'Resume_id',
      //   as: 'refunds',
      //   onDelete: 'CASCADE',
      //   onUpdate: 'CASCADE',
      // });
    }
  }

  Resume.init(
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
      modelName: 'Resume',
      tableName: 'resumes',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return Resume;
};
