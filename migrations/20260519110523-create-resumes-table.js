'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
      await queryInterface.createTable("resumes", {

      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      image: {
        type: Sequelize.STRING,
      },

      data: {
        type: Sequelize.JSON,
        allowNull: false,
      },

      desc: {
        type: Sequelize.TEXT,
      },

      template: {
        type: Sequelize.STRING,
      },

      UserId: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },

    });
    await queryInterface.addConstraint("resumes", {
      fields: ["UserId"],
      type: "foreign key",
      name: "resumes_userId_fkey",
      references: {
        table: "users",
        field: "id",
      },
    });
  },

  async down (queryInterface, Sequelize) {
    
    await queryInterface.dropTable("resumes");
  }
};
