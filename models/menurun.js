'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Menurun extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Menurun.init(
    {
      nominal: DataTypes.INTEGER,
      lamaHari: DataTypes.INTEGER,
      orang: DataTypes.INTEGER,
      biayaAdmin: DataTypes.INTEGER,
      tanggalMulai: DataTypes.DATE,
      status: DataTypes.STRING(20),
      catatan: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: 'Menurun',
    }
  );
  return Menurun;
};
