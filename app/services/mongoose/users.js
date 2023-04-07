const Users = require("../../api/v1/users/model");
const Organizers = require("../../api/v1/organizers/model");
const { BadRequestError } = require("../../errors");
const { StatusCodes } = require("http-status-codes");

const createOrganizer = async (req) => {
  const { organizer, role, email, password, confirmPassword, name } = req.body;
  if (password !== confirmPassword) {
    throw new BadRequestError("Passwords and confirmPassword do not match");
  }

  const result = await Organizers.create({ organizer }); // klo match passwordnya jalanin ini

  // simpen si email, name, passwordnya ke users
  const users = await Users.create({
    email,
    name,
    password,
    role,
    organizer: result._id, // organizer ambil dari result.organizer
  });

  delete users._doc.password; // tambahin _doc biar bisa ngedelete password, biar passwordnya ga tampil di postman API collection

  return users;
};

const createUsers = async (req, res) => {
  const { name, password, role, confirmPassword, email } = req.body;

  if (password !== confirmPassword) {
    throw new BadRequestError("Password dan Konfirmasi password tidak cocok");
  }

  const result = await Users.create({
    name,
    email,
    organizer: req.user.organizer, // tambahin ini karna kita butuh organizer idnya untuk nge-create user admin
    password,
    role,
  });

  return result;
};

const getAllUsers = async (req) => {
  const result = await Users.find();

  return result;
};

module.exports = { createOrganizer, createUsers, getAllUsers };
