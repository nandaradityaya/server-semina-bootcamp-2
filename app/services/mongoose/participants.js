const Participant = require("../../api/v1/participants/model");
const Events = require("../../api/v1/events/model");
const Orders = require("../../api/v1/orders/model");
const Payments = require("../../api/v1/payments/model");
const {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} = require("../../errors");
// const { createTokenParticipant, createJWT } = require("../../utils");
const { createTokenParticipant, createJWT } = require("../../utils");

const { otpMail } = require("../mail"); // untuk sent otp ke email

const signupParticipant = async (req) => {
  const { firstName, lastName, email, password, role } = req.body;

  // jika email dan status tidak aktif / untuk ngecek emailnya udah ada atau belum dan atau sudah aktif atau belum
  let result = await Participant.findOne({
    email,
    status: "tidak aktif",
  });

  if (result) {
    result.firstName = firstName;
    result.lastName = lastName;
    result.role = role;
    result.email = email;
    result.password = password;
    result.otp = Math.floor(Math.random() * 9999);
    await result.save();
  } else {
    // klo false jalanin ini
    result = await Participant.create({
      firstName,
      lastName,
      email,
      password,
      role,
      otp: Math.floor(Math.random() * 9999),
    });
  }

  // resultnya kirim ke emailnya
  await otpMail(email, result);

  delete result._doc.password; // delete password karna kita gamau nampilin passwordnya di email
  delete result._doc.otp; // delete otp karna kita gamau nampilin otpnya di postman

  return result;
};

// activate participant
const activateParticipant = async (req) => {
  const { otp, email } = req.body; // otp dan email dari body di kirim
  const check = await Participant.findOne({
    email,
  }); // cari atau check email participantnya

  if (!check) throw new NotFoundError("Partisipan belum terdaftar"); // klo emailnya blm terdaftar atau gaada maka throw error

  if (check && check.otp !== otp) throw new BadRequestError("Kode otp salah"); // klo otpnya salah maka throw error

  // klo semuanya bener maka jalanin ini, find by id dan update statusnya jadi aktif
  const result = await Participant.findByIdAndUpdate(
    check._id,
    {
      status: "aktif",
    },
    { new: true } // untuk nampilin data yang baru di postman, jadi klo true dia udah nampilin data terbaru yaitu status aktif
  );

  delete result._doc.password; // delete password karna kita gamau nampilin passwordnya di postman

  return result;
};

const signinParticipant = async (req) => {
  const { email, password } = req.body; // masukin email dan password di body

  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  } // email harus di isi

  const result = await Participant.findOne({ email: email }); // cari participant berdasarkan email, ada atau ngga di db

  if (!result) {
    throw new UnauthorizedError("Invalid Credentials");
  } // klo resultnya gada maka invalid credentials

  if (result.status === "tidak aktif") {
    throw new UnauthorizedError("Akun anda belum aktif");
  } // klo resultnya ada tapi statusnya tidak aktif maka akun belum aktif dan harus aktivasi dlu

  const isPasswordCorrect = await result.comparePassword(password); // cek passwordnya sama atau ngga sama dengan database

  if (!isPasswordCorrect) {
    throw new UnauthorizedError("Invalid Credentials");
  } // klo passwordnya salah maka invalid credentials

  const token = createJWT({ payload: createTokenParticipant(result) }); // klo semua benar maka generate token

  return token;
};

const getAllEvents = async (req) => {
  const result = await Events.find({ statusEvent: "Published" })
    .populate("category")
    .populate("image")
    .select("_id title date tickets venueName");

  return result;
};

const getOneEvent = async (req) => {
  const { id } = req.params;
  const result = await Events.findOne({ _id: id }) // ambil id nya aja
    .populate("category")
    .populate({ path: "talent", populate: "image" })
    .populate("image");

  if (!result) throw new NotFoundError(`Tidak ada acara dengan id :  ${id}`);

  return result;
};

const getAllOrders = async (req) => {
  console.log(req.participant);
  const result = await Orders.find({ participant: req.participant.id });
  return result;
};

/**
 * Tugas Send email invoice
 * TODO: Ambil data email dari personal detail
 *  */
const checkoutOrder = async (req) => {
  const { event, personalDetail, payment, tickets } = req.body; // ambil data dari body yaitu event, personal detail, payment, dan tickets

  const checkingEvent = await Events.findOne({ _id: event });
  if (!checkingEvent) {
    throw new NotFoundError("Tidak ada acara dengan id : " + event);
  }

  const checkingPayment = await Payments.findOne({ _id: payment });
  // check payment methodnya ada atau ngga
  if (!checkingPayment) {
    throw new NotFoundError(
      "Tidak ada metode pembayaran dengan id :" + payment
    );
  }

  let totalPay = 0, // simpan variable untuk total paymentnya
    totalOrderTicket = 0; // simpan variable untuk total ticketnya
  await tickets.forEach((tic) => {
    checkingEvent.tickets.forEach((ticket) => {
      if (tic.ticketCategories.type === ticket.type) {
        if (tic.sumTicket > ticket.stock) {
          // klo stocknya lebih kecil dari jumlah tiket yang di pesan maka throw error
          throw new NotFoundError("Stock event tidak mencukupi");
        } else {
          // klo stocknya lebih besar dari jumlah tiket yang di pesan maka kurangi stocknya (ini untuk update stocknya)
          ticket.stock -= tic.sumTicket;

          // simpan total payment dan total ticket
          totalOrderTicket += tic.sumTicket;
          totalPay += tic.ticketCategories.price * tic.sumTicket;
        }
      }
    });
  });

  await checkingEvent.save();

  const historyEvent = {
    title: checkingEvent.title,
    date: checkingEvent.date,
    about: checkingEvent.about,
    tagline: checkingEvent.tagline,
    keyPoint: checkingEvent.keyPoint,
    venueName: checkingEvent.venueName,
    tickets: tickets,
    image: checkingEvent.image,
    category: checkingEvent.category,
    talent: checkingEvent.talent,
    organizer: checkingEvent.organizer,
  };

  const result = new Orders({
    date: new Date(),
    personalDetail: personalDetail,
    totalPay,
    totalOrderTicket,
    orderItems: tickets,
    participant: req.participant.id,
    event,
    historyEvent,
    payment,
  });

  await result.save();
  return result;
};

const getAllPaymentByOrganizer = async (req) => {
  const { organizer } = req.params;

  const result = await Payments.find({ organizer: organizer });

  return result;
};

module.exports = {
  signupParticipant,
  activateParticipant,
  signinParticipant,
  getAllEvents,
  getOneEvent,
  getAllOrders,
  checkoutOrder,
  getAllPaymentByOrganizer,
};
