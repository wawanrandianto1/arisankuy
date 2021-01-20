const moment = require('moment');
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
