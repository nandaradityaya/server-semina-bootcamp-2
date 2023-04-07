const { StatusCodes } = require("http-status-codes"); // StatusCodes itu library dari npm, jadi kita gausah pake 200 atau 400 atau 404. cukup pake StatusCodes.OK itu yg artinya 200 dan lain-lain. Liat lagi aja dokumentasinya di https://www.npmjs.com/package/http-status-codes
const {
  createOrganizer,
  createUsers,
  getAllUsers,
} = require("../../../services/mongoose/users");

// Get Users
const getCMSUsers = async (req, res, next) => {
  try {
    const result = await getAllUsers(req);
    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Create
const createCMSOrganizer = async (req, res, next) => {
  try {
    const result = await createOrganizer(req); // tangkep parameter req yg di kirim dari services mongoose users

    // StatusCodes.CREATED artinya response 201 | StatusCodes itu library dari npm, jadi kita gausah pake 200 atau 400 atau 404. cukup pake StatusCodes.OK itu yg artinya 200 dan lain-lain. Liat lagi aja dokumentasinya di https://www.npmjs.com/package/http-status-codes
    res.status(StatusCodes.CREATED).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
}; // next utk nerusin custom error

const createCMSUser = async (req, res, next) => {
  try {
    const result = await createUsers(req); // tangkep parameter req yg di kirim dari services mongoose users

    // StatusCodes.CREATED artinya response 201 | StatusCodes itu library dari npm, jadi kita gausah pake 200 atau 400 atau 404. cukup pake StatusCodes.OK itu yg artinya 200 dan lain-lain. Liat lagi aja dokumentasinya di https://www.npmjs.com/package/http-status-codes
    res.status(StatusCodes.CREATED).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createCMSOrganizer,
  createCMSUser,
  getCMSUsers,
};
