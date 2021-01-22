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
  if (duos) {
    totalDuos = duos.length;
    totalHargaDuos = duos.reduce((a, b) => a.nominalKedua + b.nominalKedua);
    totalLabaDuos = duos.reduce((a, b) => a.laba + b.laba);
  }

  const menuruns = await Menurun.findAll({
    where: { username },
  });
  if (menuruns) {
    totalMenurun = menuruns.length;
    totalHargaMenurun = menuruns.reduce((a, b) => a.total + b.total);
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
