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

      this.belongsTo(models.Menurun, {
        foreignKey: 'menurunId',
        targetKey: 'id',
        as: 'menurun',
      });
    }
  }
  MenurunItem.init(
    {
      menurunId: DataTypes.INTEGER,
      urutan: DataTypes.INTEGER,
      tanggal: DataTypes.DATE,
      getArisan: DataTypes.BOOLEAN,
      hargaBayar: DataTypes.INTEGER,
      image: DataTypes.TEXT,
      status: DataTypes.STRING(20),
      username: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'MenurunItem',
    }
  );
  return MenurunItem;
};
