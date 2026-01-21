const express = require("express");
const { readDB, writeDB, loadCenters } = require("../../database/store");

const router = express.Router();

const getNextTokenNumber = (data, centerId, department) => {
  const counterKey = `${centerId}-${department || "General"}`;
  const nextNumber = (data.counters[counterKey] || 0) + 1;
  data.counters[counterKey] = nextNumber;
  return nextNumber;
};

router.post("/", (req, res) => {
  const { centerId, name, phone, purpose, department, createdBy } = req.body;

  if (!centerId || !name || !phone || !purpose) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const centers = loadCenters();
  const center = centers.find((item) => item.id === centerId);
  if (!center) {
    return res.status(404).json({ message: "Center not found" });
  }

  const data = readDB();
  const hasActiveToken = data.tokens.some(
    (token) =>
      token.centerId === centerId &&
      token.userPhone === phone &&
      ["pending", "approved"].includes(token.status)
  );

  if (hasActiveToken) {
    return res
      .status(409)
      .json({ message: "You already have an active token for this center." });
  }

  const tokenNumber = getNextTokenNumber(data, centerId, department || "General");
  const token = {
    id: `${centerId}-${Date.now()}`,
    centerId: center.id,
    centerName: center.name,
    centerCode: center.code,
    centerType: center.type,
    department: department || "General",
    createdBy: createdBy || null,
    userName: name,
    userPhone: phone,
    purpose,
    status: "pending",
    createdAt: new Date().toISOString(),
    tokenNumber,
  };

  data.tokens.push(token);
  writeDB(data);

  res.status(201).json(token);
});

router.get("/", (req, res) => {
  const { centerId, department, status, createdBy } = req.query;
  const data = readDB();
  let tokens = data.tokens || [];

  if (centerId) {
    tokens = tokens.filter((token) => token.centerId === centerId);
  }

  if (department) {
    tokens = tokens.filter((token) => token.department === department);
  }

  if (status) {
    const statuses = status.split(",").map((value) => value.trim());
    tokens = tokens.filter((token) => statuses.includes(token.status));
  }

  if (createdBy) {
    tokens = tokens.filter((token) => token.createdBy === createdBy);
  }

  tokens.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  res.json(tokens);
});

module.exports = router;
