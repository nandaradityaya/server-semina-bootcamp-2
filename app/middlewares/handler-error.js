const { StatusCodes } = require("http-status-codes");
const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    // set default
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR, // klo nemu error jalanin err.starusCode, atau klo erorrnya dari internal jalanin StatusCodes.INTERNAL_SERVER_ERROR
    msg: err.message || "Something went wrong try again later", // err.message yaitu tampilin message errornya yg udah kita set di service mongoose categories, klo message errornya ga di temuin tampilin 'Something went wrong try again later'
  };
  // error validation dari mongoose | jadi klo error validation itu misalnya field name itu required nah tp kita malah ga isi nah itu bakal muncul error validation ky gini. liat requirednya tuh yg udah kita set di model
  if (err.name === "ValidationError") {
    customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(", ");
    customError.statusCode = 400;
  }

  // error handling untuk code kita, contohnya ky kita memberikan nama variable yg sama dan nanti di kasih tau juga object keynya yg error yg mana
  if (err.code && err.code === 11000) {
    customError.msg = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )} field, please choose another value`;
    customError.statusCode = 400;
  }

  // error handling utk nemuin variable yg ga kita buat tapi kia panggil di sebagai property
  if (err.name === "CastError") {
    customError.msg = `No item found with id : ${err.value}`;
    customError.statusCode = 404;
  }

  return res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandlerMiddleware;
