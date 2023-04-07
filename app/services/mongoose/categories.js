// Service utk categories, jadi ini nanti tinggal pake aja di page yg butuh ini. dan jadi gampang klo ada perubahan jg tinggal ubah dari sini aja gaperlu ubah di masing2 page

const Categories = require("../../api/v1/categories/model");
const { BadRequestError, NotFoundError } = require("../../errors");

// service getAllCategories
const getAllCategories = async (req) => {
  const result = await Categories.find({ organizer: req.user.organizer }); // cari categpries | cari categories dengan field organizer user

  return result;
};

// service create categories
const createCategories = async (req) => {
  const { name } = req.body; // membuat categories baru menggunakan data dari `name` | kirimin req.bodynya dan tangkep parameter req di controller utk createCategories

  // cari categories dengan field name
  const check = await Categories.findOne({
    name,
    organizer: req.user.organizer,
  }); // sebelum create cari dlu namanya udah ada blm, klo namanya udah ada yg pake maka tampilin BadRequestError di bawah beserta pesannya | req.user.organizer ini berarti kita filter berdasarkan organizer yg mana yg login, karna organizer A bakal beda dgn organizer B, misal A udah punya nama kategori "Seminar" dan B belum punya, maka itu masih bisa untuk ngecreate. kecuali si B juga udah punya maka itu gabisa ngecreate karna duplikat

  // apa bila check true / data categories sudah ada maka kita tampilkan error bad request dengan message kategori nama duplikat
  if (check) throw new BadRequestError("kategori nama duplikat");

  // klo namanya blm ada yg pake baru deh jalanin ini
  const result = await Categories.create({
    name,
    organizer: req.user.organizer,
  }); // simpan Category yang baru dibuat ke MongoDB
  return result;
};

// service getOneCategories
const getOneCategories = async (req) => {
  const { id } = req.params; // pake id biar yg di get di url itu /:id. Jadi harus di samain
  const result = await Categories.findOne({
    _id: id,
    organizer: req.user.organizer,
  }); // find idnya | cari categories dengan field _id dan organizer user
  if (!result) throw new NotFoundError(`Tidak ada Kategori dengan id :  ${id}`); // buat nangkep error, jadi klo id category ga di temukan tampilin error disini

  return result;
};

// Service updateCategories
const updateCategories = async (req) => {
  const { id } = req.params; // pake id biar yg di get di url itu /:id. Jadi harus di samain
  const { name } = req.body;

  // cari categories dengan field name dan id selain dari yang dikirim dari params
  const check = await Categories.findOne({
    name,
    organizer: req.user.organizer, // cari categories dengan field organizer user
    _id: { $ne: id }, // $ne itu buat tandain jangan cari id yg udah ada gue jg gatau ni bingung di episode 19 custom error part 3 backend
  });

  // apa bila check true / data categories sudah di pake namanya maka kita tampilkan error bad request dengan message kategori nama duplikat
  if (check) throw new BadRequestError("kategori nama duplikat");

  // klo nama blm ada yg pake baru deh jalanin ini jd dia berhasil
  const result = await Categories.findOneAndUpdate(
    { _id: id },
    { name },
    { new: true, runValidators: true }
  );

  // jika id result false / null / tidak di temukan maka akan menampilkan error `Tidak ada Kategori dengan id` yang dikirim client
  if (!result) throw new NotFoundError(`Tidak ada Kategori dengan id :  ${id}`);

  return result;
};

// Service utk deleteCategories
const deleteCategories = async (req) => {
  const { id } = req.params; // pake id biar yg di get di url itu /:id. Jadi harus di samain

  const result = await Categories.findOne({
    _id: id, // find idnya dulu
    organizer: req.user.organizer, // cari categories dengan field organizer user
  });

  // klo idnya gada masuk ini
  if (!result) throw new NotFoundError(`Tidak ada Kategori dengan id :  ${id}`);

  // klo idnya ketemu remove deh
  await result.remove();

  return result;
};

const checkingCategories = async (id) => {
  const result = await Categories.findOne({
    _id: id,
  });

  if (!result) throw new NotFoundError(`Tidak ada Kategori dengan id :  ${id}`);

  return result;
};

module.exports = {
  getAllCategories,
  createCategories,
  getOneCategories,
  updateCategories,
  deleteCategories,
  checkingCategories,
};
