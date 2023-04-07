// import di index semua handle errornya, supaya bisa di pake di seluruh page yg butuh ini
// Loh kok ? semua diimport kedalam app/errors/index.js iya tujuannya agar nantinya kita cukup import file app/errors/index.js untuk memanggil masing-masing custom error yang kita butuhkan tanpa harus mengimport satu-persatu custom error.

const CustomAPIError = require("./custom-api-error");
const BadRequestError = require("./bad-request");
const NotFoundError = require("./not-found");
const UnauthorizedError = require("./unauthorized");
const UnauthenticatedError = require("./unauthenticated");

module.exports = {
  CustomAPIError,
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
  UnauthenticatedError,
};
