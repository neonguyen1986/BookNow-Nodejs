'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      email: 'admin@gmail.com',
      password: '12345', //phải đổi thành hash password
      firstName: 'Minh',
      lastName: 'Nguyen',
      address: 'Canada',
      gender: 1,
      roleId: 'ROLE R1',
      phoneNumber: '84123456',
      positionId: 'Admin',
      image: '123',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
