'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Duos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      nominalPertama: {
        defaultValue: 0,
        type: Sequelize.INTEGER,
      },
      nominalKedua: {
        defaultValue: 0,
        type: Sequelize.INTEGER,
      },
      total: {
        defaultValue: 0,
        type: Sequelize.INTEGER,
      },
      laba: {
        defaultValue: 0,
        type: Sequelize.INTEGER,
      },
      biayaAdmin: {
        defaultValue: 0,
        type: Sequelize.INTEGER,
      },
      lamaHari: {
        defaultValue: 0,
        type: Sequelize.INTEGER,
      },
      tanggalMulai: {
        type: Sequelize.DATE,
      },
      status: {
        defaultValue: 'pending',
        type: Sequelize.STRING(20), // pending, mulai, diundur, berakhir
      },
      namaPasangan: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('Duos');
  },
};
