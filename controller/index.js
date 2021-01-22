const auth = require('./AuthController');
const duo = require('./DuoController');
const menurun = require('./MenurunController');
const menurunItem = require('./MenurunItemController');
const report = require('./ReportController');

module.exports = {
  auth,
  duo,
  menurun,
  menurunItem,
  report,
};
