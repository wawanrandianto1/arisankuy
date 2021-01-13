const cron = require('node-cron');
const moment = require('moment');
const { Op } = require('sequelize');
const { MenurunItem } = require('../models');
const { changeStatusMenurunItem } = require('../helper/general');

// every 8 hour
cron.schedule('0 0 */8 * * *', async () => {
  const startDay = moment().startOf('day');
  const endDay = moment().endOf('day');
  // console.log(startDay);
  // console.log(endDay);
  const allMenurunItem = await MenurunItem.findAll({
    attributes: ['id', 'menurunId', 'tanggal', 'urutan', 'username'],
    where: {
      tanggal: { [Op.between]: [startDay.toDate(), endDay.toDate()] },
      status: 'start',
    },
  });

  try {
    if (allMenurunItem) {
      const promises = [];
      for (let i = 0; i < allMenurunItem.length; i++) {
        const el = allMenurunItem[i];
        const query = await changeStatusMenurunItem(el);
        promises.push(query);
      }

      if (promises.length) {
        await Promise.all(promises);
      }
    }
  } catch (errs) {
    console.log(errs.message);
  }
});
