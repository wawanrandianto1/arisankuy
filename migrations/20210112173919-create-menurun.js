'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Menuruns', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      total: {
        defaultValue: 0,
        type: Sequelize.INTEGER,
      },
      nominal: {
        defaultValue: 0,
        type: Sequelize.INTEGER,
      },
      lamaHari: {
        defaultValue: 0,
        type: Sequelize.INTEGER,
      },
      urutan: {
        defaultValue: 0,
        type: Sequelize.INTEGER,
      },
      orang: {
        defaultValue: 0,
        type: Sequelize.INTEGER,
      },
      biayaAdmin: {
        defaultValue: 0,
        type: Sequelize.INTEGER,
      },
      tanggalMulai: {
        type: Sequelize.DATE,
      },
      tanggalGet: {
        type: Sequelize.DATE,
      },
      status: {
        defaultValue: 'pending', // pending, mulai, berakhir
        type: Sequelize.STRING(20),
      },
      catatan: {
        type: Sequelize.TEXT,
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
    await queryInterface.dropTable('Menuruns');
  },
};
