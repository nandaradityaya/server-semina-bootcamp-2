// custom bad request error | error 400

const { StatusCodes } = require("http-status-codes"); // import http-status-codes
const CustomAPIError = require("./custom-api-error"); // import custom-api

// BadRequest nge-extends ke CustomAPIError kita
class BadRequest extends CustomAPIError {
  constructor(message) {
    super(message);
    // memberikan statusCode bad request | ini yg di parsing ke middleware handling error kita
    this.statusCode = StatusCodes.BAD_REQUEST; // Bad request digunakan saat ada request yang tidak sesuai dari client ke server contohnya saat kita menambahkan categories dengan name yang sama maka request dari server akan memberikan statusCode bad-request dengan message duplicate name.
  }
}
module.exports = BadRequest;
