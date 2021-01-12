'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Duo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Duo.init(
    {
      nominalPertama: DataTypes.INTEGER,
      nominalKedua: DataTypes.INTEGER,
      biayaAdmin: DataTypes.INTEGER,
      lamaHari: DataTypes.INTEGER,
      tanggalMulai: DataTypes.DATE,
      status: DataTypes.STRING(20), // pending, mulai, diundur, berakhir
      namaPasangan: DataTypes.STRING,
      catatan: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: 'Duo',
    }
  );
  return Duo;
};
