const express = require('express');
const passport = require('passport');

const router = express.Router();
const indexController = require('../controller/index');
const { uploadFotoMenurun } = require('../config/multerConfig');

router.post('/register', indexController.auth.register);
router.post('/login', indexController.auth.login);

router.get(
  '/dashboard',
  passport.authenticate('jwt', { session: false }),
  indexController.report.dashboard
);

router.get(
  '/userdata',
  passport.authenticate('jwt', { session: false }),
  indexController.auth.getUserData
);

router.post(
  '/userdevice/save',
  passport.authenticate('jwt', { session: false }),
  indexController.auth.saveUserDevice
);

router.post(
  '/change/password',
  passport.authenticate('jwt', { session: false }),
  indexController.auth.changePassword
);

router.post(
  '/userdevice/delete',
  passport.authenticate('jwt', { session: false }),
  indexController.auth.removeUserDevice
);

router.get(
  '/duo/list',
  passport.authenticate('jwt', { session: false }),
  indexController.duo.listDuo
);
router.post(
  '/duo/create',
  passport.authenticate('jwt', { session: false }),
  indexController.duo.createDuo
);
router.post(
  '/duo/start/:id',
  passport.authenticate('jwt', { session: false }),
  indexController.duo.startDuo
);
router.post(
  '/duo/finish/:id',
  passport.authenticate('jwt', { session: false }),
  indexController.duo.finishDuo
);
router.post(
  '/duo/delete/:id',
  passport.authenticate('jwt', { session: false }),
  indexController.duo.hapusDuo
);
router.get(
  '/duo/detail/:id',
  passport.authenticate('jwt', { session: false }),
  indexController.duo.detailDuo
);

router.get(
  '/menurun/list',
  passport.authenticate('jwt', { session: false }),
  indexController.menurun.listMenurun
);
router.post(
  '/menurun/create',
  passport.authenticate('jwt', { session: false }),
  indexController.menurun.createMenurun
);
router.post(
  '/menurun/start/:id',
  passport.authenticate('jwt', { session: false }),
  indexController.menurun.startMenurun
);
router.post(
  '/menurun/delete/:id',
  passport.authenticate('jwt', { session: false }),
  indexController.menurun.deleteMenurun
);
router.get(
  '/menurun/detail/:id',
  passport.authenticate('jwt', { session: false }),
  indexController.menurun.detailMenurun
);

router.get(
  '/menurunitem/list',
  passport.authenticate('jwt', { session: false }),
  indexController.menurunItem.getStartList
);
router.post(
  '/menurunitem/bayar/:id',
  uploadFotoMenurun,
  passport.authenticate('jwt', { session: false }),
  indexController.menurunItem.bayarItem
);

module.exports = router;
