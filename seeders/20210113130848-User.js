'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert(
      'Users',
      [
        {
          nama: 'wawan',
          username: 'wanz',
          email: 'wawan.myemail@gmail.com',
          password: bcrypt.hashSync('12345', bcrypt.genSaltSync(10), null),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nama: 'Sherin',
          username: 'sherin',
          email: 'wawan.myemail@gmail.com',
          password: bcrypt.hashSync('132223', bcrypt.genSaltSync(10), null),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Users', null, {});
  },
};
