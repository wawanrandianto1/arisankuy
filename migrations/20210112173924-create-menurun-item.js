'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('MenurunItems', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      menurunId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      urutan: {
        type: Sequelize.INTEGER,
      },
      tanggal: {
        type: Sequelize.DATE,
      },
      getArisan: {
        type: Sequelize.BOOLEAN,
      },
      hargaBayar: {
        defaultValue: 0,
        type: Sequelize.INTEGER,
      },
      image: {
        type: Sequelize.TEXT,
      },
      status: {
        defaultValue: 'pending',
        type: Sequelize.STRING(20),
      },
      username: {
        type: Sequelize.STRING,
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
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('MenurunItems');
  },
};
