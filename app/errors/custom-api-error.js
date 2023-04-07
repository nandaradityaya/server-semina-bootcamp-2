// custom api error

// kumpulan error nanti di extend, lalu kita buat constructor yang nerima message
class CustomAPIError extends Error {
  constructor(message) {
    super(message);
  }
}
module.exports = CustomAPIError;
