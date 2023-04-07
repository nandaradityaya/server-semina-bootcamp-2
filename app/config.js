const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  // urlDb: process.env.URL_MONGODB_DEV,
  // jwtExpiration: "24h", // bikin expired tokennya 24 jam
  // jwtSecret: "jwtSecret", // bikin secret key buat jwt

  urlDb: process.env.URL_MONGODB_DEV,
  jwtExpiration: process.env.JWT_EXPIRATION,
  // jwtSecret: process.env.JWT_SECRET,
  jwtSecret: "jwtSecret",
  jwtRefreshTokenExpiration: process.env.JWT_REFRESH_TOKEN_EXPIRATION,
  jwtRefreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
  gmail: process.env.GMAIL,
  password: process.env.PASSWORD,
};
