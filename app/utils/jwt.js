const jwt = require("jsonwebtoken"); // ini library jsonwebtoken
const { jwtSecret, jwtExpiration } = require("../config");

// ini utk create token
const createJWT = ({ payload }) => {
  const token = jwt.sign(payload, jwtSecret, { expiresIn: jwtExpiration }); // jwt sign itu buat bikin token, payload itu data yg mau di masukin ke token, jwtSecret itu secret key buat jwt, expiresIn itu expired tokennya
  return token;
};

const isTokenValid = ({ token }) => jwt.verify(token, jwtSecret); // ini utk ngecek token valid atau ngga

module.exports = {
  createJWT,
  isTokenValid,
};
