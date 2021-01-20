const multer = require('multer');
const moment = require('moment');
const path = require('path');

// ? DEFINE MAX SIZE OF IMAGE UPLOAD (set configuration here)
const maxSize = 2 * (1024 * 1024); // 2MB

const uploadMenurunPath = 'public/menurun/';
const uploadDuosPath = 'public/duos/';

// ====================================================== //
// ?=============== UPLOAD FOTO ========================= //
// ====================================================== //
const storageFoto1 = multer.diskStorage({
  destination: `./${uploadMenurunPath}`,
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}${moment().format('x')}${path.extname(
        file.originalname
      )}`
    );
  },
});
const uploadFotoMenurun = multer({
  storage: storageFoto1,
  fileFilter: (req, file, callback) => {
    const ext = path.extname(file.originalname);
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
      req.fileValidationError = 'Only images are allowed';
      return callback(null, false);
    }
    return callback(null, true);
  },
  limits: { fileSize: maxSize },
}).single('image_menurun');

// ====================================================== //
// ?=============== UPLOAD FOTO DUOS ========================= //
// ====================================================== //
const storageFoto2 = multer.diskStorage({
  destination: `./${uploadDuosPath}`,
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}${moment().format('x')}${path.extname(
        file.originalname
      )}`
    );
  },
});
const uploadFotoDuos = multer({
  storage: storageFoto2,
  fileFilter: (req, file, callback) => {
    const ext = path.extname(file.originalname);
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
      req.fileValidationError = 'Only images are allowed';
      return callback(null, false);
    }
    return callback(null, true);
  },
  limits: { fileSize: maxSize },
}).single('image_duos');

module.exports = {
  uploadFotoMenurun,
  uploadFotoDuos,
};
