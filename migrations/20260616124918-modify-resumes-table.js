'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn("resumes", "image");
    await queryInterface.removeColumn("resumes", "data");
    await queryInterface.removeColumn("resumes", "template");
    await queryInterface.renameColumn("resumes", "desc", "description");
    await queryInterface.changeColumn("resumes", "description", {
      type: Sequelize.STRING(255),
      allowNull: true,
    });
    await queryInterface.changeColumn("resumes", "id", {
      type: Sequelize.STRING(36)
    });
    
    await queryInterface.changeColumn("resumes", "title", {
      type: Sequelize.STRING(100),
      allowNull: false,
    });

    await queryInterface.removeConstraint("resumes", "resumes_userId_fkey");
    await queryInterface.renameColumn("resumes", "UserId", "user_id");
    await queryInterface.addConstraint("resumes", {
      fields: ["user_id"],
      type: "foreign key",
      name: "resumes_userId_fkey",
      references: {
        table: "users",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    await queryInterface.renameColumn("resumes", "createdAt", "created_at");
    await queryInterface.renameColumn("resumes", "updatedAt", "updated_at");
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.renameColumn("resumes", "updated_at", "updatedAt");
    await queryInterface.renameColumn("resumes", "created_at", "createdAt");
    await queryInterface.removeConstraint("resumes", "resumes_userId_fkey");
    await queryInterface.renameColumn("resumes", "user_id", "UserId");
    await queryInterface.addConstraint("resumes", {
      fields: ["UserId"],
      type: "foreign key",
      name: "resumes_userId_fkey",
      references: {
        table: "users",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    await queryInterface.changeColumn("resumes", "title", {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.changeColumn("resumes", "id", {
      type: Sequelize.INTEGER,
      autoIncrement: true,
    });
    await queryInterface.changeColumn("resumes", "description", {
      type: Sequelize.TEXT,
    });
    await queryInterface.renameColumn("resumes", "description", "desc");
    await queryInterface.addColumn("resumes", "template", {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn("resumes", "data", {
      type: Sequelize.JSON,
      allowNull: false,
    });
    await queryInterface.addColumn("resumes", "image", {
      type: Sequelize.STRING,
    });
  }
};
