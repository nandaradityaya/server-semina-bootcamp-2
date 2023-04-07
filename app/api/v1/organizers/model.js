const mongoose = require("mongoose");
const { model, Schema } = mongoose;

let organizersSchema = Schema(
  {
    organizer: {
      type: String,
      minLength: [3, "Panjang nama penyelenggara minimal 3 karakter"],
      maxLength: [20, "Panjang nama penyelenggara maksimal 20 karakter"],
      required: [true, "Nama Penyelenggara harus diisi"],
    },
  },
  { timestamps: true } // tiap kali ngecreate bakal ada waktunya ky create at
);

module.exports = model("Organizer", organizersSchema);
