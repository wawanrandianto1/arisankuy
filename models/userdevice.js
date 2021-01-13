'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserDevice extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, {
        foreignKey: 'userId',
        targetKey: 'id',
        as: 'user',
      });
    }
  }
  UserDevice.init(
    {
      userId: DataTypes.INTEGER,
      deviceToken: DataTypes.TEXT,
      deviceOs: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: 'UserDevice',
    }
  );
  return UserDevice;
};
