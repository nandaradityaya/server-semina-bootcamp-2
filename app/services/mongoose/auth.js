const Users = require("../../api/v1/users/model");
const { BadRequestError, UnauthorizedError } = require("../../errors");
const { createTokenUser, createJWT } = require("../../utils");

// ini sistem login
const signin = async (req) => {
  const { email, password } = req.body; // waktu login itu ngirim dua field yaitu email dan password dari req.body

  if (!email || !password) {
    throw new BadRequestError("Please provide email and password"); // jika email dan password kosong dia suruh isi email dan password
  }

  const result = await Users.findOne({ email: email }); // cari di dalem collection email ada atau ngga emailnya (terdaftar atau ngga)

  // jika emailnya blm terdaftar ya invalid credentials | pake invalid credential biar user atau hacker gatau yg salah itu email atau passwordnya
  if (!result) {
    throw new UnauthorizedError("Invalid Credentials");
  }

  // jika emailnya udah terdaftar, cek passwordnya yg di kirim dari req.body ke parameter di bawah. cek sama dengan yg di db atau ngga
  const isPasswordCorrect = await result.comparePassword(password);

  // klo passwordnya salah/false ya invalid credentials
  if (!isPasswordCorrect) {
    throw new UnauthorizedError("Invalid Credentials");
  }

  // klo passwordnya bener/true ya create tokennya | payloadnya kirim ke jwt
  const token = createJWT({ payload: createTokenUser(result) });

  return token;
};

module.exports = { signin };
