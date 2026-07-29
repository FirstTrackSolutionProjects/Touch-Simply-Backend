'use strict';
const hashPassword = require('../utils/bcrypt/hashPassword');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users', [
      {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        phone: '1234567890',
        password: await hashPassword('password'),
        isBlocked: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', {
      email: 'test@example.com',
    });
  },
};