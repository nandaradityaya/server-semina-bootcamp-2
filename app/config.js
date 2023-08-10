const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  // urlDb: process.env.URL_MONGODB_DEV,
  // jwtExpiration: "24h", // bikin expired tokennya 24 jam
  // jwtSecret: "jwtSecret", // bikin secret key buat jwt

  urlDb: process.env.URL_MONGODB_DEV,
  jwtExpiration: process.env.JWT_EXPIRATION,
  // jwtSecret: process.env.JWT_SECRET_KEY,
  jwtSecret: "jwtSecret",
  jwtRefreshTokenSecret: process.env.JWT_SECRET_KEY_REFRESH_TOKEN,
  jwtRefreshTokenExpiration: process.env.JWT_EXPIRATION_KEY_REFRESH_TOKEN,
  gmail: process.env.GMAIL,
  password: process.env.PASSWORD,
};
