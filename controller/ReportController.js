const { User, UserDevice, Duo, Menurun, MenurunItem } = require('../models');

module.exports.dashboard = async (req, res) => {
  const { username } = req.user;

  let totalDuos = 0;
  let totalHargaDuos = 0;
  let totalLabaDuos = 0;

  let totalMenurun = 0;
  let totalHargaMenurun = 0;

  const duos = await Duo.findAll({
    where: { username },
  });
  if (duos.length) {
    totalDuos = duos.length;
    duos.forEach((el) => {
      totalHargaDuos += el.nominalKedua;
      totalLabaDuos += el.laba;
    });
  }

  const menuruns = await Menurun.findAll({
    where: { username },
  });
  if (menuruns.length) {
    totalMenurun = menuruns.length;
    menuruns.forEach((el) => {
      totalHargaMenurun += el.total;
    });
  }

  return res.status(200).json({
    status: true,
    totalDuos,
    totalHargaDuos,
    totalLabaDuos,
    totalMenurun,
    totalHargaMenurun,
  });
};
