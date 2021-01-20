const cron = require('node-cron');
const moment = require('moment');
const { MenurunItem, Menurun } = require('../models');
const { sendNotifMobile } = require('../helper/general');

cron.schedule('*/5 * * * * *', async () => {
  const allMenurunItem = await MenurunItem.findAll({
    include: [
      {
        model: Menurun,
        as: 'menurun',
        attributes: { exclude: ['updatedAt', 'username', 'catatan'] },
      },
    ],
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    where: { status: 'start' },
  });

  try {
    if (allMenurunItem) {
      const promises = [];
      for (let i = 0; i < allMenurunItem.length; i++) {
        const el = allMenurunItem[i];
        const formatMoment = moment(el.tanggal);
        const jarakWaktuSebelum = formatMoment.diff(moment(), 'days') + 1;
        if (jarakWaktuSebelum <= 5 && jarakWaktuSebelum >= 0) {
          const query = await sendNotifMobile(el);
          promises.push(query);
        }
      }

      if (promises.length) {
        await Promise.all(promises);
      }
    }
  } catch (errs) {
    console.log(errs.message);
  }
});
