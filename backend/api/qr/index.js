const express = require("express");
const { readDB } = require("../../database/store");

const router = express.Router();

router.get("/:code", (req, res) => {
  const { code } = req.params;
  const data = readDB();
  const qr = data.qrCodes.find((item) => item.code === code);

  if (!qr) {
    return res.status(404).json({ message: "QR code not found" });
  }

  res.json(qr);
});

module.exports = router;
