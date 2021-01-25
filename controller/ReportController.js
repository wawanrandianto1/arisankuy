const { Duo, Menurun, MenurunItem } = require('../models');

module.exports.dashboard = async (req, res) => {
  const { username } = req.user;

  let totalDuosStart = 0;
  let totalHargaDuosStart = 0;
  let totalLabaDuosStart = 0;

  let totalDuosEnd = 0;
  let totalHargaDuosEnd = 0;
  let totalLabaDuosEnd = 0;

  let totalMenurun = 0;
  let totalHargaMenurun = 0;

  const duosStart = await Duo.findAll({
    where: { username, status: 'start' },
  });
  if (duosStart.length) {
    totalDuosStart = duosStart.length;
    duosStart.forEach((el) => {
      totalHargaDuosStart += el.nominalKedua;
      totalLabaDuosStart += el.laba;
    });
  }

  const duosEnd = await Duo.findAll({
    where: { username, status: 'end' },
  });
  if (duosEnd.length) {
    totalDuosEnd = duosEnd.length;
    duosEnd.forEach((el) => {
      totalHargaDuosEnd += el.nominalKedua;
      totalLabaDuosEnd += el.laba;
    });
  }

  const menuruns = await Menurun.findAll({
    where: { username, status: 'start' },
  });
  if (menuruns.length) {
    totalMenurun = menuruns.length;
    menuruns.forEach((el) => {
      totalHargaMenurun += el.total;
    });
  }

  return res.status(200).json({
    status: true,
    totalDuosStart,
    totalHargaDuosStart,
    totalLabaDuosStart,
    totalDuosEnd,
    totalHargaDuosEnd,
    totalLabaDuosEnd,
    totalMenurun,
    totalHargaMenurun,
  });
};
