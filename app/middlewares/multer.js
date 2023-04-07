const multer = require("multer"); //Multer adalah middleware node.js untuk menangani multipart/form-data, yang terutama digunakan untuk mengunggah file.

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/"); // destination itu simpennya dimana
  },
  filename: function (req, file, cb) {
    cb(null, Math.floor(Math.random() * 99999999) + "-" + file.originalname); // untuk nama yg di uploadnya nanti generate ky gini
  },
});

// file formmatnya harus jpeg/png/jpg
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true); // klo true dia ga ngapa2in
  } else {
    //reject file | klo filenya ke reject tampilin ini, misal formatnya ga sesuai sm yg di minta di atas
    cb(
      {
        message: "Unsupported file format",
      },
      false
    );
  }
};

const uploadMiddleware = multer({
  storage,
  limits: {
    fileSize: 3000000, // limit maksimal file sizenya (3mb)
  },
  fileFilter: fileFilter, // jalanin fileFilternya lagi
});

module.exports = uploadMiddleware;
