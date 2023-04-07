const express = require("express");
const router = express();
const { create, index, find, destroy, update } = require("./controller.js"); // panggil create yg dari controller
const {
  authenticateUser,
  authorizeRoles,
} = require("../../../middlewares/auth"); // panggil middleware auth

router.get("/categories", authenticateUser, authorizeRoles("organizer"), index); // munculin id dan name | authenticateUser itu utk ngecek middleware auth | authorizeRoles("organizer") artinya yang boleh akses categories cuma organizer aja
router.get(
  "/categories/:id",
  authenticateUser,
  authorizeRoles("organizer"),
  find
); // mencari yg idnya sekian | authenticateUser itu utk ngecek middleware auth
router.put(
  "/categories/:id",
  authenticateUser,
  authorizeRoles("organizer"),
  update
); // untuk update json di postman | authenticateUser itu utk ngecek middleware auth
router.delete(
  "/categories/:id",
  authenticateUser,
  authorizeRoles("organizer"),
  destroy
); // untuk menghapus json di postman | bedain delete dan destroy, jangan sama2 delete namanya nanti error
router.post(
  "/categories",
  authenticateUser,
  authorizeRoles("organizer"),
  create
); // untuk men-create json di postman | authenticateUser itu utk ngecek middleware auth

module.exports = router;
