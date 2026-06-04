'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.createTable("logos", {

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
    await queryInterface.addConstraint("logos", {
      fields: ["UserId"],
      type: "foreign key",
      name: "logos_userId_fkey",
      references: {
        table: "users",
        field: "id",
      },
    });
  },

  async down(queryInterface, Sequelize) {

    await queryInterface.dropTable("logos");

  },
};