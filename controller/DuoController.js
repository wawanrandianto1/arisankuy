const moment = require('moment');
const { Op } = require('sequelize');
const { Duo } = require('../models');
const Paginator = require('../helper/paginator');

module.exports.createDuo = (req, res) => {
  const {
    nominalPertama, // nominal lawan
    nominalKedua, // nominal kita
    biayaAdmin,
    lamaHari,
    namaPasangan,
    catatan,
    tanggalMulai,
    status = 'pending',
  } = req.body;
  const { username } = req.user;

  req
    .checkBody('nominalPertama', 'Nominal Lawan harus diisi.')
    .notEmpty()
    .isInt();
  req.checkBody('nominalKedua', 'Nominal Kita harus diisi.').notEmpty().isInt();
  req.checkBody('biayaAdmin', 'Biaya Admin harus diisi.').notEmpty().isInt();
  req.checkBody('lamaHari', 'Lama Hari harus diisi.').notEmpty().isInt();
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

  const selisih = parseInt(nominalPertama, 10) - parseInt(nominalKedua, 10);
  let laba = 0;
  if (selisih < 0) {
    laba = selisih;
  } else {
    laba = selisih - parseInt(biayaAdmin, 10);
  }

  if (status === 'start') {
    return Duo.create({
      nominalPertama: parseInt(nominalPertama, 10),
      nominalKedua: parseInt(nominalKedua, 10),
      total: parseInt(nominalPertama, 10) + parseInt(nominalKedua, 10),
      laba,
      biayaAdmin: parseInt(biayaAdmin, 10),
      lamaHari: parseInt(lamaHari, 10),
      namaPasangan,
      tanggalMulai: moment(tanggalMulai, 'DD-MM-YYYY').toDate(),
      catatan,
      status,
      username,
    })
      .then(() =>
        res.status(200).json({ status: true, message: 'Sukses buat duos.' })
      )
      .catch((err) =>
        res.status(422).json({ status: false, message: err.message })
      );
  }

  return Duo.create({
    nominalPertama: parseInt(nominalPertama, 10),
    nominalKedua: parseInt(nominalKedua, 10),
    total: parseInt(nominalPertama, 10) + parseInt(nominalKedua, 10),
    laba,
    biayaAdmin: parseInt(biayaAdmin, 10),
    lamaHari: parseInt(lamaHari, 10),
    namaPasangan,
    catatan,
    status,
    username,
  })
    .then(() =>
      res.status(200).json({ status: true, message: 'Sukses buat duos.' })
    )
    .catch((err) =>
      res.status(422).json({ status: false, message: err.message })
    );
};

module.exports.startDuo = async (req, res) => {
  const { id } = req.params;

  req.checkBody('tanggalMulai', 'Tanggal Mulai harus diisi.').notEmpty();
  const errors = req.validationErrors();
  if (errors) {
    return res.status(422).json({ status: false, message: errors[0].msg });
  }

  const { tanggalMulai } = req.body;
  const duo = await Duo.findByPk(id);
  if (!duo) {
    return res
      .status(422)
      .json({ status: false, message: 'Data tidak ditemukan.' });
  }

  if (duo.status !== 'pending') {
    return res
      .status(422)
      .json({ status: false, message: 'Duos tidak pending' });
  }

  return duo
    .update(
      {
        status: 'start',
        tanggalMulai: moment(tanggalMulai, 'DD-MM-YYYY').toDate(),
      },
      {
        returning: true,
        plain: true,
      }
    )
    .then(() =>
      res
        .status(200)
        .json({ status: true, message: 'Duos berjalan.', data: duo })
    )
    .catch((err) =>
      res.status(422).json({ status: false, message: err.message })
    );
};

module.exports.listDuo = (req, res) => {
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

  return Duo.findAll({
    attributes: { exclude: ['updatedAt'] },
    where,
    limit,
    offset,
    order: [[by, sort]],
  })
    .then(async (result) => {
      const count = await Duo.findAll({
        attributes: ['id'],
        where,
      });
      const data = result;
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

module.exports.finishDuo = async (req, res) => {
  const { id } = req.params;

  const duo = await Duo.findByPk(id);
  if (!duo) {
    return res
      .status(422)
      .json({ status: false, message: 'Data tidak ditemukan.' });
  }

  if (duo.status !== 'start') {
    return res
      .status(422)
      .json({ status: false, message: 'Duos tidak berjalan' });
  }

  return duo
    .update({ status: 'end' })
    .then(() =>
      res.status(200).json({ status: true, message: 'Duos berakhir.' })
    )
    .catch((err) =>
      res.status(422).json({ status: false, message: err.message })
    );
};

module.exports.hapusDuo = async (req, res) => {
  const { id } = req.params;

  const duo = await Duo.findByPk(id);
  if (!duo) {
    return res
      .status(422)
      .json({ status: false, message: 'Data tidak ditemukan.' });
  }

  return duo
    .destroy()
    .then(() =>
      res.status(200).json({ status: true, message: 'Duos dihapus.' })
    )
    .catch((err) =>
      res.status(422).json({ status: false, message: err.message })
    );
};

module.exports.detailDuo = async (req, res) => {
  const { id } = req.params;

  const duo = await Duo.findByPk(id);
  if (!duo) {
    return res
      .status(422)
      .json({ status: false, message: 'Data tidak ditemukan.' });
  }

  return res.status(200).json({ status: true, data: duo });
};
