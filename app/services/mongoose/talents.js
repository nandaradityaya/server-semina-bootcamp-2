const Talents = require("../../api/v1/talents/model"); // import model Talents
const { checkingImage } = require("./images");

// import custom error not found dan bad request
const { NotFoundError, BadRequestError } = require("../../errors");

const getAllTalents = async (req) => {
  const { keyword } = req.query; // keyword ini filter pencarian berdasarkan name | liat nih keywordnya di kirim ga sama user, klo keyword ini di kirim sama user di search bar maka jalanin if yg di bawah. req.query itu berarti utk ngambil apa yg di tulisin user di search bar

  // fungsi conditional ini jadi untuk nampung semua data yg mau kita filter
  let condition = { organizer: req.user.organizer }; // tampilin data berdasarkan user yg login, ini filter berdasarkan organizernya

  // klo keywordnya ada maka jalanin ini. keywordnya masuk ke dalam name:, karena di sini sistemnya search berdasarkan nama, lalu ada spreada operator
  // di kasih spread operator biar semua yg di search itu muncul gada yg hilang, misal ada nama Nanda Raditya dan Nanda Amanjaya, klo kita searchnya cuma Nanda maka kan yg muncul semua yg bernama nanda, nah di pakein spread operator biar semua yg bernama Nanda itu muncul, klo ga pake spread operator cuma bakalan muncul salah satu nama Nanda, dan biasanya itu nama nanda yg paling terakhir, makanya di sini kita spread biar ke bagi dan muncul semua
  if (keyword) {
    condition = { ...condition, name: { $regex: keyword, $options: "i" } }; // kasih spread operator, filter berdasarkan name. regex utk memanipulasi string kita, jadi apapun yg user ketik akan user dapatkan di filter pencaharian. options i itu untuk manipulasi stringnya biar mau huruf kecil atau gede sama aja. jadi fungsi regex itu utk searching dengan mengetikan keyword apapun akan berhasil
  }

  const result = await Talents.find(condition) // masukin object conditionnya, jadi ketika conditionnya punya object name maka dia bakal filter berdasarkan yg user ketik, tp klo user ga ngetik apapun di pencaharian maka tampilkan semuanya
    .populate({
      // populate itu utk nampilin data yg kita pilih, nah yg kita pilih ini id name dan image
      path: "image", // fungsi path itu kita path atau ambil berdasarkan referensi dari field image dari model talent yg udah kita relasiin dengan model images
      select: "_id name", // lalu select yang mau kita pake di model Talentsnya, disini kita mau pake id dan name dari image itu aja, jadi ky created_at dll gausah di pake
    }) // pada intinya populate itu untuk bikin relasi antar model, kasusnya di sini model Talents mau pake image yg ada di model Images, jadi kita panggil populate lalu panggil image dan id name image yg sudah di upload di model Images (Eps.23 Talent API part 2)
    .select("_id name role image"); // fungsi select di sini utk nampilin data talentnya, jadi kita nampilin id, name, role, dan image

  return result;
};

// create talent
const createTalents = async (req) => {
  const { name, role, image } = req.body; // pilot yg di kirim dari body yaitu name, role, dan image

  // cari image dengan field image
  await checkingImage(image);

  // cari talents dengan field name
  const check = await Talents.findOne({ name, organizer: req.user.organizer }); // check talentnya udah ada atau blm soalnya namanya gaboleh sama | req.user.organizer ini berarti kita filter berdasarkan organizer yg login

  // apa bila check true / data talents sudah ada maka kita tampilkan error bad request dengan message pembicara sudah terdaftar
  if (check) throw new BadRequestError("pembicara sudah terdaftar");

  const result = await Talents.create({
    name,
    image,
    role,
    organizer: req.user.organizer,
  }); // klo lolos dari check di atas yaudah dia bakal create name, image, dan rolenya | req.user.organizer ini berarti kita filter berdasarkan organizer yg mana yg login, karna organizer A gabisa liat organizer B

  return result;
};

const getOneTalents = async (req) => {
  const { id } = req.params;

  const result = await Talents.findOne({
    _id: id,
    organizer: req.user.organizer,
  })
    .populate({
      path: "image",
      select: "_id name",
    })
    .select("_id name role image");

  if (!result)
    throw new NotFoundError(`Tidak ada pembicara dengan id :  ${id}`);

  return result;
};

// Update Talent
const updateTalents = async (req) => {
  const { id } = req.params;
  const { name, image, role } = req.body;

  // cari image dengan field image
  await checkingImage(image);

  // cari talents dengan field name dan id selain dari yang dikirim dari params
  const check = await Talents.findOne({
    name,
    organizer: req.user.organizer, // filter berdasarkan organizer yg mana yg login
    _id: { $ne: id }, // ne itu not equal atau tidak sama dengan
  });

  // apa bila check true / data talents sudah ada maka kita tampilkan error bad request dengan message pembicara nama duplikat
  if (check) throw new BadRequestError("pembicara sudah terdaftar");

  const result = await Talents.findOneAndUpdate(
    { _id: id },
    { name, image, role, organizer: req.user.organizer },
    { new: true, runValidators: true }
  ); // klo dia lolos dia bakal update datanya di sini

  // jika id result false / null maka akan menampilkan error `Tidak ada pembicara dengan id` yang dikirim client
  if (!result)
    throw new NotFoundError(`Tidak ada pembicara dengan id :  ${id}`);

  return result;
};

// Delete talent
const deleteTalents = async (req) => {
  const { id } = req.params;

  const result = await Talents.findOne({
    _id: id,
    organizer: req.user.organizer, // filter berdasarkan organizer yg mana yg login
  });

  if (!result)
    throw new NotFoundError(`Tidak ada pembicara dengan id :  ${id}`);

  await result.remove();

  return result;
};

// checking talent
const checkingTalents = async (id) => {
  const result = await Talents.findOne({ _id: id });

  if (!result)
    throw new NotFoundError(`Tidak ada pembicara dengan id :  ${id}`);

  return result;
};

// Get All user
const getAllUsers = async (req) => {
  const result = await Users.find();

  return result;
};

module.exports = {
  getAllTalents,
  createTalents,
  getOneTalents,
  updateTalents,
  deleteTalents,
  checkingTalents,
};
