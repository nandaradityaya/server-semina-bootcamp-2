const { UnauthenticatedError, UnauthorizedError } = require("../errors");
const { isTokenValid } = require("../utils/jwt");

const authenticateUser = async (req, res, next) => {
  try {
    let token;
    // check header
    const authHeader = req.headers.authorization; // ambil authorization dari header di postman

    // jika authHeadernya ada maka jalanin "Bearer"
    if (authHeader && authHeader.startsWith("Bearer")) {
      token = authHeader.split(" ")[1]; // ambil token dari authHeader. lalu split yaitu ambil setelah spasi. lalu ambil index ke 1 yaitu si tokennya
    }

    if (!token) {
      throw new UnauthenticatedError("Authentication invalid");
    }

    const payload = isTokenValid({ token }); // panggil isTokenValid dari utils/jwt.js | utk cek si token valid atau ngga

    // Attach the user and his permissions to the req object
    req.user = {
      email: payload.email,
      role: payload.role,
      name: payload.name,
      organizer: payload.organizer,
      id: payload.userId,
    };

    next();
  } catch (error) {
    next(error);
  }
};

const authenticateParticipant = async (req, res, next) => {
  try {
    let token;
    // check header
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer")) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      throw new UnauthenticatedError("Authentication invalid");
    }

    const payload = isTokenValid({ token });

    // Attach the user and his permissions to the req object
    req.participant = {
      email: payload.email,
      lastName: payload.lastName,
      firstName: payload.firstName,
      id: payload.participantId, // harus participantId karena di atas di createTokenParticipant kita bikin participantId
    };

    next();
  } catch (error) {
    next(error);
  }
};

const authorizeRoles = (...roles) => {
  // spread operator biar nanti dia jadi array
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      // includes itu bawaan javascript untuk mem-filter array atau ngecek ada atau nggak role yg di kirim dari req.user.role, jadi ketika rolesnya false maka jalanin UnauthorizedError
      throw new UnauthorizedError("Unauthorized to access this route");
    }
    next(); // klo true baru deh jalanin next
  };
};

module.exports = { authenticateUser, authorizeRoles, authenticateParticipant };
