const { StatusCodes } = require("http-status-codes"); // StatusCodes itu library dari npm, jadi kita gausah pake 200 atau 400 atau 404. cukup pake StatusCodes.OK itu yg artinya 200 dan lain-lain. Liat lagi aja dokumentasinya di https://www.npmjs.com/package/http-status-codes
const {
  getAllCategories,
  createCategories,
  getOneCategories,
  updateCategories,
  deleteCategories,
} = require("../../../services/mongoose/categories");

// Create
const create = async (req, res, next) => {
  try {
    const result = await createCategories(req); // tangkep parameter req yg di kirim dari services mongoose categories

    // StatusCodes.CREATED artinya response 201 | StatusCodes itu library dari npm, jadi kita gausah pake 200 atau 400 atau 404. cukup pake StatusCodes.OK itu yg artinya 200 dan lain-lain. Liat lagi aja dokumentasinya di https://www.npmjs.com/package/http-status-codes
    res.status(StatusCodes.CREATED).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
}; // next utk nerusin custom error

// munculin index dengan id dan name di postman
const index = async (req, res, next) => {
  try {
    const result = await getAllCategories(req); // panggil services mongoose di sini

    // StatusCodes.OK artinya response 200 | StatusCodes itu library dari npm, jadi kita gausah pake 200 atau 400 atau 404. cukup pake StatusCodes.OK itu yg artinya 200 dan lain-lain. Liat lagi aja dokumentasinya di https://www.npmjs.com/package/http-status-codes
    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// mencari atau findOne berdasarkan id
const find = async (req, res, next) => {
  try {
    const result = await getOneCategories(req); // find idnya dari services mongose categories dan si function getOneCategories

    // StatusCodes.OK artinya response 200 | StatusCodes itu library dari npm, jadi kita gausah pake 200 atau 400 atau 404. cukup pake StatusCodes.OK itu yg artinya 200 dan lain-lain. Liat lagi aja dokumentasinya di https://www.npmjs.com/package/http-status-codes
    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Update
const update = async (req, res, next) => {
  try {
    const result = await updateCategories(req); // find namanya dari services mongose categories dan si function updateCategories dan nerima params req

    // StatusCodes.OK artinya response 200 | StatusCodes itu library dari npm, jadi kita gausah pake 200 atau 400 atau 404. cukup pake StatusCodes.OK itu yg artinya 200 dan lain-lain. Liat lagi aja dokumentasinya di https://www.npmjs.com/package/http-status-codes
    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const destroy = async (req, res, next) => {
  try {
    const result = await deleteCategories(req); // find idnya dari yg dikirimin di services mongoose categories dan terima reqnya abis itu remove deh by id

    // StatusCodes.OK artinya response 200 | StatusCodes itu library dari npm, jadi kita gausah pake 200 atau 400 atau 404. cukup pake StatusCodes.OK itu yg artinya 200 dan lain-lain. Liat lagi aja dokumentasinya di https://www.npmjs.com/package/http-status-codes
    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  index,
  find,
  update,
  destroy,
  create,
};
