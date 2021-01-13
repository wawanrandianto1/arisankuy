'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.UserDevice, {
        foreignKey: 'userId',
        sourceKey: 'id',
        as: 'devices',
      });
    }

    beforeCreate(user, options) {
      if (user.changed('password')) {
        // eslint-disable-next-line no-param-reassign
        user.password = bcrypt.hashSync(
          user.password,
          bcrypt.genSaltSync(10),
          null
        );
      }
    }

    comparePassword(passw, callback) {
      bcrypt.compare(passw, this.password, function (err, isMatch) {
        if (err) {
          return callback(err);
        }
        callback(null, isMatch);
      });
    }
  }
  User.init(
    {
      nama: DataTypes.STRING,
      username: DataTypes.STRING,
      email: DataTypes.TEXT,
      password: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: 'User',
    }
  );
  return User;
};
