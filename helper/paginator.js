const _ = require('lodash');

class Paginator {
  constructor(page, perPage) {
    this.currentPage = (!_.isNumber(page) ? Number(page) : page) || 1;
    this.perPage = (!_.isNumber(perPage) ? Number(perPage) : perPage) || 4;
    this.lastPage = 0;
    this.countAllData = 0;
    this.pages = null;
    this.data = [];
    return this;
  }

  setCount(countAllData) {
    this.countAllData = Number(countAllData);
    return this;
  }

  getLastPage() {
    this.lastPage = Math.ceil(this.countAllData / this.perPage - 1 + 1);
    return this.lastPage;
  }

  getPaginator() {
    this.getLastPage();
    if (!this.pages) {
      this.getPages();
    }
    return this;
  }

  getCurrentPage() {
    return this.currentPage;
  }

  getLimit() {
    return this.perPage;
  }

  getPages() {
    this.pages = [];
    let i;
    for (i = 1; i < this.lastPage + 1; i += 1) {
      this.pages.push(i);
    }
    return this.pages;
  }

  getOffset() {
    return (this.currentPage - 1) * this.perPage;
  }

  setData(data) {
    this.data = data;
    return this;
  }
}

module.exports = Paginator;

// ##################################################################### //
// ####################### EXAMPLE USE PAGINATOR ####################### //
// ##################################################################### //
// router.get(
//   '/category/all',
//   passport.authenticate('jwt', { session: false }),
//   async (req, res) => {
//     let { page, by, sort = 'ASC', limit } = req.query;
//     page = Number(page || 1);
//     limit = Number(limit || 10);
//     const paginator = new Paginator(page, limit);
//     const offset = paginator.getOffset();

//     return MeditationCategory.findAndCountAll({
//       offset,
//       limit,
//       order: [[by, sort]]
//     })
//       .then(data => {
//         const { count } = data;
//         const items = data.rows;
//         paginator.setCount(count);
//         paginator.setData(items);
//         res.status(200).json({
//           status: true,
//           pagination: paginator.getPaginator()
//         });
//       })
//       .catch(err => {
//         return res.status(422).json({ status: false, message: err.message });
//       });
//   }
// );
