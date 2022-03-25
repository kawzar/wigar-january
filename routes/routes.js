const express = require("express");
const router = express.Router();
const path = require("path");

router.get("/gallery", async (req, res) => {
  res.sendFile(path.resolve("public/gallery.html"));
});

router.get("/coc", async (req, res) => {
  res.sendFile(path.resolve("public/coc.html"));
});

module.exports = {
  router: router,
};
