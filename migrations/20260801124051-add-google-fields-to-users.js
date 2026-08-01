'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add googleId column
    await queryInterface.addColumn('users', 'googleId', {
      type: Sequelize.STRING(255),
      allowNull: true,
      unique: true,
    });

    // Add provider column
    await queryInterface.addColumn('users', 'provider', {
      type: Sequelize.ENUM('local', 'google'),
      defaultValue: 'local',
      allowNull: false,
    });

    // Add googlePicture column
    await queryInterface.addColumn('users', 'googlePicture', {
      type: Sequelize.STRING(500),
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove columns in reverse order
    await queryInterface.removeColumn('users', 'googlePicture');
    await queryInterface.removeColumn('users', 'provider');
    await queryInterface.removeColumn('users', 'googleId');
    
    // Drop the ENUM type
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS enum_users_provider;');
  }
};