const Images = require("../../api/v1/images/model");
const { NotFoundError } = require("../../errors");

// 1. kita gunain cara yg di bawah ini
// 2. generate url setelah submit baru kita simpen imagesnya

// ini cara ke 2. generate url setelah submit baru kita simpen imagesnya
const generateUrlImage = async (req) => {
  const result = `uploads/${req.file.filename}`; // ini generate dlu urlnya, klo udah submit baru deh jalanin yg bawah

  return result;
};

// ini cara  ke 1. kita gunain cara yg di bawah ini
const createImages = async (req) => {
  const result = await Images.create({
    name: req.file // cek req.filenya (ada ga yg ngasih kita file upload imagesnya)
      ? `uploads/${req.file.filename}` // klo filenya ada ambil atau gabungin filenamenya
      : "uploads/avatar/default.png", // klo gada berarti tinggal kasih default foto avatar aja
  });

  return result;
};

// tambahkan function checking Image dan nerima parameter id
const checkingImage = async (id) => {
  const result = await Images.findOne({ _id: id }); // cari berdasarkan id
  console.log(result);

  if (!result) throw new NotFoundError(`Tidak ada Gambar dengan id :  ${id}`);

  return result;
};

module.exports = { createImages, generateUrlImage, checkingImage };
