const moment = require('moment');
const { Op } = require('sequelize');
const { Menurun, MenurunItem, sequelize } = require('../models');

const changeStatusMenurunItem = async (data) => {
  const { urutan, menurunId, id, username } = data;
  const getMenurun = await Menurun.findByPk(menurunId);
  if (!getMenurun) {
    return false;
  }

  const transaction = await sequelize.transaction();
  try {
    if (parseInt(urutan, 10) < parseInt(getMenurun.orang, 10)) {
      const nextUrutan = parseInt(urutan, 10) + 1;
      await MenurunItem.update(
        { status: 'end' },
        { where: { id }, transaction }
      );
      await MenurunItem.update(
        { status: 'start' },
        { where: { menurunId, urutan: nextUrutan, username }, transaction }
      );
    } else {
      // akhir arisan
      await MenurunItem.update(
        { status: 'end' },
        { where: { id }, transaction }
      );
      await getMenurun.update({ status: 'end' }, { transaction });
    }
    await transaction.commit();
    return true;
  } catch (errs) {
    await transaction.rollback();
    console.log(errs.message);
    return false;
  }
};

const sendNotifMobile = async (data) => {};

const validEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

module.exports = {
  validEmail,
  changeStatusMenurunItem,
  sendNotifMobile,
};
