const moment = require('moment');
const { Op } = require('sequelize');
const { Menurun, MenurunItem, sequelize } = require('../models');
const Paginator = require('../helper/paginator');

module.exports.createMenurun = (req, res) => {
  const { username } = req.user;
  const {
    nominal,
    total,
    lamaHari,
    urutan,
    orang,
    biayaAdmin,
    catatan,
    status = 'pending',
    tanggalMulai,
  } = req.body;

  req.checkBody('nominal', 'Harga harus diisi.').notEmpty().isInt();
  req.checkBody('total', 'Total harus diisi.').notEmpty().isInt();
  req.checkBody('lamaHari', 'Lama Hari harus diisi.').notEmpty().isInt();
  req.checkBody('urutan', 'Urutan harus diisi.').notEmpty().isInt();
  req.checkBody('orang', 'Jumlah Orang harus diisi.').notEmpty().isInt();
  req.checkBody('biayaAdmin', 'Biaya Admin harus diisi.').notEmpty().isInt();
  if (status === 'start') {
    req.checkBody('tanggalMulai', 'Tanggal Mulai harus diisi.').notEmpty();
  }
  const errors = req.validationErrors();
  if (errors) {
    return res.status(422).json({ status: false, message: errors[0].msg });
  }

  if (['pending', 'start'].indexOf(status) < 0) {
    return res.status(422).json({ status: false, message: 'Status salah.' });
  }

  if (status === 'start') {
    let tanggalGet = null;
    const arrMenurunItems = [];
    for (let i = 1; i <= parseInt(orang, 10); i++) {
      let lamaWaktu = i * parseInt(lamaHari, 10);
      let prefixTanggal = moment(tanggalMulai, 'DD-MM-YYYY').add(
        lamaWaktu,
        'days'
      );

      let boolGet = false;
      if (i === parseInt(urutan, 10)) {
        tanggalGet = prefixTanggal.toDate();
        boolGet = true;
      }

      if (i === 1) {
        arrMenurunItems.push({
          // menurunId: id,
          urutan: i,
          tanggal: prefixTanggal.toDate(),
          hargaBayar: parseInt(biayaAdmin, 10) + parseInt(nominal, 10),
          status: 'start',
          username,
          getArisan: boolGet,
        });
      } else {
        arrMenurunItems.push({
          // menurunId: id,
          urutan: i,
          tanggal: prefixTanggal.toDate(),
          hargaBayar: parseInt(nominal, 10),
          status: 'pending',
          username,
          getArisan: boolGet,
        });
      }
    }

    return Menurun.create({
      total: parseInt(total, 10),
      nominal: parseInt(nominal, 10),
      lamaHari: parseInt(lamaHari, 10),
      urutan: parseInt(urutan, 10),
      orang: parseInt(orang, 10),
      biayaAdmin: parseInt(biayaAdmin, 10),
      status,
      catatan,
      username,
      tanggalMulai: moment(tanggalMulai, 'DD-MM-YYYY').toDate(),
      tanggalGet,
    })
      .then(async (data) => {
        if (arrMenurunItems.length) {
          const newArray = arrMenurunItems.map((el) => {
            return { ...el, menurunId: data.id };
          });
          await MenurunItem.bulkCreate(newArray);
        }

        return res
          .status(200)
          .json({ status: true, message: 'Sukses buat menurun.' });
      })
      .catch((err) =>
        res.status(422).json({ status: false, message: err.message })
      );
  }

  return Menurun.create({
    total: parseInt(total, 10),
    nominal: parseInt(nominal, 10),
    lamaHari: parseInt(lamaHari, 10),
    urutan: parseInt(urutan, 10),
    orang: parseInt(orang, 10),
    biayaAdmin: parseInt(biayaAdmin, 10),
    status,
    catatan,
    username,
  })
    .then(() =>
      res.status(200).json({ status: true, message: 'Sukses buat menurun.' })
    )
    .catch((err) =>
      res.status(422).json({ status: false, message: err.message })
    );
};

module.exports.startMenurun = async (req, res) => {
  const { id } = req.params;
  const { username } = req.user;

  req.checkBody('tanggalMulai', 'Tanggal Mulai harus diisi.').notEmpty();
  const errors = req.validationErrors();
  if (errors) {
    return res.status(422).json({ status: false, message: errors[0].msg });
  }

  const { tanggalMulai } = req.body;
  const menurun = await Menurun.findByPk(id);
  if (!menurun) {
    return res
      .status(422)
      .json({ status: false, message: 'Data tidak ditemukan.' });
  }

  if (menurun.status !== 'pending') {
    return res
      .status(422)
      .json({ status: false, message: 'Menurun tidak pending' });
  }

  const insertTanggal = moment(tanggalMulai, 'DD-MM-YYYY').toDate();
  const { nominal, lamaHari, orang, biayaAdmin, urutan } = menurun;

  let tanggalGet = null;
  const arrMenurunItems = [];
  for (let i = 1; i <= orang; i++) {
    let lamaWaktu = i * lamaHari;
    let prefixTanggal = moment(tanggalMulai, 'DD-MM-YYYY').add(
      lamaWaktu,
      'days'
    );

    let boolGet = false;
    if (i === urutan) {
      tanggalGet = prefixTanggal.toDate();
      boolGet = true;
    }

    if (i === 1) {
      arrMenurunItems.push({
        menurunId: id,
        urutan: i,
        tanggal: prefixTanggal.toDate(),
        hargaBayar: biayaAdmin + nominal,
        status: 'start',
        username,
        getArisan: boolGet,
      });
    } else {
      arrMenurunItems.push({
        menurunId: id,
        urutan: i,
        tanggal: prefixTanggal.toDate(),
        hargaBayar: nominal,
        status: 'pending',
        username,
        getArisan: boolGet,
      });
    }
  }

  const transaction = await sequelize.transaction();
  try {
    await menurun.update(
      {
        status: 'start',
        tanggalMulai: insertTanggal,
        tanggalGet,
      },
      { transaction }
    );

    if (arrMenurunItems.length) {
      await MenurunItem.bulkCreate(arrMenurunItems, { transaction });
    }

    await transaction.commit();
  } catch (errs) {
    await transaction.rollback();
    return res.status(422).json({ status: false, message: errs.message });
  }

  return res.status(200).json({
    status: true,
    message: 'Menurun berjalan',
  });
};

module.exports.listMenurun = (req, res) => {
  let { page, limit, sort = 'asc', by = 'tanggalMulai' } = req.query;
  page = Number(page || 1);
  limit = Number(limit || 100);
  const paginator = new Paginator(page, limit);
  const offset = paginator.getOffset();

  if (['tanggalMulai', 'total'].indexOf(by) < 0) {
    by = 'tanggalMulai';
  }
  if (['asc', 'desc'].indexOf(sort) < 0) {
    sort = 'asc';
  }

  let { status } = req.query;
  const {
    firstNominal = 0,
    secondNominal = 100000000,
    startDate,
    endDate,
  } = req.query;
  const where = {};

  // nominal range
  Object.assign(where, {
    total: {
      [Op.between]: [parseInt(firstNominal, 10), parseInt(secondNominal, 10)],
    },
  });

  // date range check first
  if (startDate) {
    if (moment(startDate, 'DD-MM-YYYY', true).isValid() === false) {
      return res
        .status(422)
        .json({ status: false, message: 'Tanggal start salah.' });
    }
  }
  if (endDate) {
    if (moment(endDate, 'DD-MM-YYYY', true).isValid() === false) {
      return res
        .status(422)
        .json({ status: false, message: 'Tanggal end salah.' });
    }
  }

  // date range
  if (startDate && endDate) {
    Object.assign(where, {
      tanggalMulai: {
        [Op.between]: [
          moment(startDate, 'DD-MM-YYYY').toDate(),
          moment(endDate, 'DD-MM-YYYY').toDate(),
        ],
      },
    });
  } else if (startDate && !endDate) {
    Object.assign(where, {
      tanggalMulai: {
        [Op.gt]: moment(startDate, 'DD-MM-YYYY').toDate(),
      },
    });
  } else if (endDate && !startDate) {
    Object.assign(where, {
      tanggalMulai: {
        [Op.lt]: moment(endDate, 'DD-MM-YYYY').toDate(),
      },
    });
  }

  // status
  if (status) {
    if (['pending', 'start', 'end'].indexOf(status) < 0) {
      status = 'pending';
    }
    Object.assign(where, {
      status,
    });
  }

  return Menurun.findAll({
    include: [
      {
        model: MenurunItem,
        as: 'items',
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        where: { status: 'start' },
        required: false,
      },
    ],
    where,
    attributes: { exclude: ['updatedAt'] },
    limit,
    offset,
    order: [[by, sort]],
  })
    .then(async (result) => {
      const count = await Menurun.findAll({
        attributes: ['id'],
        where,
      });
      const data = result.rows;
      paginator.setCount(count.length);
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

module.exports.deleteMenurun = async (req, res) => {
  const { id } = req.params;
  const { username } = req.user;

  const menurun = await Menurun.findByPk(id);
  if (!menurun) {
    return res
      .status(422)
      .json({ status: false, message: 'Data tidak ditemukan.' });
  }

  const transaction = await sequelize.transaction();
  try {
    if (menurun.status !== 'pending') {
      await MenurunItem.destroy({
        where: {
          menurunId: id,
          username,
        },
        transaction,
      });
    }

    await menurun.destroy({ transaction });

    await transaction.commit();
  } catch (errs) {
    await transaction.rollback();
    return res.status(422).json({ status: false, message: errs.message });
  }

  return res.status(200).json({
    status: true,
    message: 'Menurun dihapus',
  });
};

module.exports.detailMenurun = async (req, res) => {
  const { id } = req.params;
  const { username } = req.user;

  const menurun = await Menurun.findOne({
    include: [
      {
        model: MenurunItem,
        as: 'items',
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      },
    ],
    where: { id, username },
    attributes: { exclude: ['updatedAt'] },
  });
  if (!menurun) {
    return res
      .status(422)
      .json({ status: false, message: 'Data tidak ditemukan.' });
  }

  return res.status(200).json({
    status: true,
    data: menurun,
  });
};
