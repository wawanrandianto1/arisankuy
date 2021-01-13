const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { validEmail } = require('../helper/general');

const secretKey = process.env.SECRET_KEY;

module.exports.register = async (req, res) => {
  req.checkBody('email', 'Email required.').notEmpty();
  req.checkBody('password', 'Password required.').notEmpty();
  req.checkBody('nama', 'Nama required.').notEmpty();
  req.checkBody('username', 'Username required.').notEmpty();
  const errors = req.validationErrors();
  if (errors) {
    return res.status(422).json({ status: false, message: errors[0].msg });
  }

  const { nama, email, username, password } = req.body;
  let enkripPass = bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);

  const checkUsername = await User.count({ where: { username } });
  if (checkUsername > 0) {
    return res
      .status(422)
      .json({ status: false, message: 'Username sudah terpakai.' });
  }

  return User.create({
    email,
    password: enkripPass,
    nama,
    username,
  })
    .then(() =>
      res.status(200).json({ status: true, message: 'Sukses registrasi.' })
    )
    .catch((err) =>
      res.status(422).json({ status: false, message: err.message })
    );
};

module.exports.login = async (req, res) => {
  req.checkBody('password', 'Password required.').notEmpty();
  req.checkBody('username', 'Username required.').notEmpty();
  const errors = req.validationErrors();
  if (errors) {
    return res.status(422).json({ status: false, message: errors[0].msg });
  }

  const { username, password } = req.body;

  const where = {};
  if (validEmail(username)) {
    Object.assign(where, { email: username });
  } else {
    Object.assign(where, { username });
  }

  return User.findOne({
    where,
  })
    .then(async (user) => {
      if (!user) {
        return res.status(401).json({
          status: false,
          message: 'Login gagal, akun tidak ditemukan.',
        });
      }

      return user.comparePassword(password, async (error, isMatch) => {
        if (error || !isMatch) {
          return res
            .status(401)
            .json({ status: false, message: 'Login gagal.' });
        }

        const payload = { id: user.id, username: user.username };
        // success login
        return jwt.sign(payload, secretKey, async (err, token) => {
          if (err) {
            return res
              .status(500)
              .json({ status: false, message: 'Login gagal, server error.' });
          }

          return res.status(200).json({
            status: true,
            message: 'Login success',
            token,
          });
        });
      });
    })
    .catch((err) => {
      // return res.status(422).json({ status: false, message: 'Login gagal, server error.' });
      return res.status(422).json({
        status: false,
        message: `Login gagal, server error. [${err.message}]`,
      });
    });
};
