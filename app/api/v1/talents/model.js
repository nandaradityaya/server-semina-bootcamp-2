const mongoose = require("mongoose");
const { model, Schema } = mongoose;

let talentSchema = Schema(
  {
    name: {
      type: String,
      required: [true, "Nama harus diisi"],
    },
    role: {
      type: String,
      default: "-", // default isi strip aja klo blm tau dia mau required atau ngga
    },
    // untuk membuat relasi pada mongodb kita perlu membuat types ObjectId
    image: {
      type: mongoose.Types.ObjectId, // untuk membuat relasi pada mongodb kita perlu membuat types ObjectId, jadi biar dia tau ini bentuknya uuid
      ref: "Image", // pastiin arahnya ke model Image dan namanya harus sama dengan model di folder Images yaitu "Image", karena ref ini utk referensi dan kita butuh ref itu karna tabel/collection talents dan images saling berelasi
      required: true, // required
    },
    // relasi ke organizer
    organizer: {
      type: mongoose.Types.ObjectId,
      ref: "Organizer",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = model("Talent", talentSchema);
