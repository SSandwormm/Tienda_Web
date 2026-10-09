const port = process.env.PORT || 4000;
const jwtSecret = process.env.JWT_SECRET || 'goat_secret';
const jwtExpiresIn = '8h';

module.exports = {
  PORT: port,
  JWT_SECRET: jwtSecret,
  JWT_EXPIRES_IN: jwtExpiresIn,
};