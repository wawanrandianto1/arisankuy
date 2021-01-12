'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MenurunItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  MenurunItem.init(
    {
      menurunId: DataTypes.INTEGER,
      tanggal: DataTypes.DATE,
      hargaBayar: DataTypes.INTEGER,
      status: DataTypes.STRING(20),
    },
    {
      sequelize,
      modelName: 'MenurunItem',
    }
  );
  return MenurunItem;
};
