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
        references: {
          model: "Users",
          key: "id",
        },
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

  },

  async down(queryInterface, Sequelize) {

    await queryInterface.dropTable("logos");

  },
};