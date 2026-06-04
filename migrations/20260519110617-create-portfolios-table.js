'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.createTable("portfolios", {

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
    await queryInterface.addConstraint("portfolios", {
      fields: ["UserId"],
      type: "foreign key",
      name: "portfolios_userId_fkey",
      references: {
        table: "users",
        field: "id",
      },
    });
  },

  async down(queryInterface, Sequelize) {

    await queryInterface.dropTable("portfolios");

  },
};