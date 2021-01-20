const moment = require('moment');
const path = require('path');
const { Menurun, MenurunItem, sequelize } = require('../models');
const Paginator = require('../helper/paginator');

module.exports.getStartList = async (req, res) => {
  let { page, limit, sort = 'asc', by = 'createdAt' } = req.query;
  page = Number(page || 1);
  limit = Number(limit || 25);
  const paginator = new Paginator(page, limit);
  const offset = paginator.getOffset();

  return MenurunItem.findAndCountAll({
    include: [
      {
        model: Menurun,
        as: 'menurun',
        attributes: { exclude: ['updatedAt'] },
      },
    ],
    where: { status: 'start' },
    limit,
    offset,
    order: [[by, sort]],
  })
    .then((result) => {
      const count = result.count;
      const data = result.rows;
      paginator.setCount(count);
      paginator.setData(data);
      return res.status(200).json({
        status: true,
        data: paginator.getPaginator(),
      });
    })
    .catch((err) => {
      // console.log(err.message);
      return res.status(422).json({ status: false, message: err.message });
    });
};

module.exports.bayarItem = async (req, res) => {
  const { id } = req.params;
  const image = req.file ? req.file.path : null;

  let fullUrl = null;
  if (image) {
    fullUrl = path.join(req.protocol + '://' + req.get('host'), image);
  }

  const menurunItem = await MenurunItem.findByPk(id);
  if (!menurunItem) {
    return res
      .status(422)
      .json({ status: false, message: 'Data tidak ditemukan.' });
  }

  const { urutan, menurunId, username } = menurunItem;
  const getMenurun = await Menurun.findByPk(menurunId);
  if (!getMenurun) {
    return res
      .status(422)
      .json({ status: false, message: 'Data tidak ditemukan.' });
  }

  const transaction = await sequelize.transaction();
  try {
    if (parseInt(urutan, 10) < parseInt(getMenurun.orang, 10)) {
      const nextUrutan = parseInt(urutan, 10) + 1;
      await MenurunItem.update(
        { status: 'end', image: fullUrl },
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
  } catch (errs) {
    await transaction.rollback();
    // console.log(errs.message);
    return res.status(422).json({ status: false, message: errs.message });
  }

  return res.status(200).json({
    status: true,
    message: 'Arisan menurun telah dibayar.',
  });
};
