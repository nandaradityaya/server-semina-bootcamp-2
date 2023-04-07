const express = require("express");
const router = express();
const {
  createCMSOrganizer,
  createCMSUser,
  getCMSUsers,
} = require("./controller.js"); // panggil create yg dari controller
const {
  authenticateUser,
  authorizeRoles,
} = require("../../../middlewares/auth");

router.post(
  "/organizers",
  authenticateUser,
  authorizeRoles("owner"), // yang bisa ngecreate organizer hanya owner
  createCMSOrganizer
); // munculin id dan name
router.post(
  "/users",
  authenticateUser,
  authorizeRoles("organizer"),
  createCMSUser
); // munculin id dan name | authenticateUser itu utk ngecek middleware auth artinya yang boleh akses categories cuma organizer aja, user admin gabakal bisa | authorizeRoles("organizer") artinya yang boleh create user hanya organizer aja

router.get("/users", authenticateUser, authorizeRoles("owner"), getCMSUsers);

module.exports = router;
