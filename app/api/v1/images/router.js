const express = require("express");
const router = express();
const { create } = require("./controller.js"); // panggil create yg dari controller
const upload = require("../../../middlewares/multer.js"); // import multernya

router.post("/images", upload.single("avatar"), create); // untuk men-create json di postman | di middleware ini sebelum masuk harus lewatin upload dulu, karna dia single jadi satu, string namenya bebas aja disini gua make avatar, tp di postman juga harus samain nama key upload imagenya avatar juga

module.exports = router;
