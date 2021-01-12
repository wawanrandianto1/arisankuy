require('dotenv').config();
const { ExtractJwt, Strategy } = require('passport-jwt');

const models = require('../models');

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET_KEY;

module.exports = (passport) => {
  passport.use(
    'jwt',
    new Strategy(opts, (jwtPayload, done) => {
      if (jwtPayload) return done(null, jwtPayload);
      return done(null, false, { message: 'Invalid credential.' });
    })
  );

  passport.serializeUser((user, done) => {
    // console.log('Inside serializeUser callback. User id is save to the session file store here');
    return done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    // console.log('Inside deserializeUser callback');
    // console.log(`The user id passport saved in the session file store is: ${id}`);
    return models.User.findByPk(id)
      .then((user) => done(null, user))
      .catch((err) => done(err, false));
  });
};
