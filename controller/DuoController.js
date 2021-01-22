const moment = require('moment');
const { Duo } = require('../models');
const Paginator = require('../helper/paginator');

module.exports.createDuo = (req, res) => {
  req.checkBody('nominalPertama', 'Harga Pertama required.').notEmpty().isInt();
  req.checkBody('nominalKedua', 'Harga Kedua required.').notEmpty().isInt();
  req.checkBody('biayaAdmin', 'Biaya Admin required.').notEmpty().isInt();
  req.checkBody('lamaHari', 'Lama Hari required.').notEmpty().isInt();
  const errors = req.validationErrors();
  if (errors) {
    return res.status(422).json({ status: false, message: errors[0].msg });
  }

  const {
    nominalPertama, // nominal lawan
    nominalKedua, // nominal kita
    biayaAdmin,
    lamaHari,
    namaPasangan,
    catatan,
  } = req.body;
  const { username } = req.user;

  const selisih = parseInt(nominalPertama, 10) - parseInt(nominalKedua, 10);
  let laba = 0;
  if (selisih < 0) {
    laba = selisih;
  } else {
    laba = selisih - parseInt(biayaAdmin, 10);
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
    status: 'pending',
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

  req.checkBody('tanggalMulai', 'Tanggal Mulai required.').notEmpty();
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
    .update({
      status: 'start',
      tanggalMulai: moment(tanggalMulai, 'DD-MM-YYYY').toDate(),
    })
    .then(() =>
      res.status(200).json({ status: true, message: 'Duos berjalan.' })
    )
    .catch((err) =>
      res.status(422).json({ status: false, message: err.message })
    );
};

module.exports.listDuo = (req, res) => {
  let { page, limit, sort = 'asc', by = 'tanggalMulai' } = req.query;
  page = Number(page || 1);
  limit = Number(limit || 25);
  const paginator = new Paginator(page, limit);
  const offset = paginator.getOffset();

  if (['tanggalMulai', 'total'].indexOf(by) < 0) {
    by = 'tanggalMulai';
  }
  if (['asc', 'desc'].indexOf(sort) < 0) {
    sort = 'asc';
  }

  let { status } = req.query;
  const where = {};
  if (status) {
    if (['pending', 'start', 'end'].indexOf(status) < 0) {
      status = 'pending';
    }
    Object.assign(where, {
      status,
    });
  }

  return Duo.findAndCountAll({
    attributes: { exclude: ['updatedAt'] },
    where,
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
