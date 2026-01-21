const express = require("express");
const { ensureAdmins, readDB, writeDB, loadCenters } = require("../../database/store");

const router = express.Router();

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const data = ensureAdmins();
  const admin = data.admins.find(
    (item) => item.username === username && item.password === password
  );

  if (!admin) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  res.json({
    id: admin.id,
    role: "admin",
    centerId: admin.centerId,
    centerName: admin.centerName,
    centerCode: admin.centerCode,
    centerType: admin.centerType,
  });
});

router.post("/register", (req, res) => {
  const { centerId, centerCode, password } = req.body;

  if (!centerId || !centerCode || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const centers = loadCenters();
  const center = centers.find((item) => item.id === centerId);
  if (!center) {
    return res.status(404).json({ message: "Center not found" });
  }

  if (center.code !== centerCode) {
    return res.status(401).json({ message: "Invalid center code" });
  }

  const data = ensureAdmins();
  const existingIndex = data.admins.findIndex((admin) => admin.centerId === centerId);

  const adminPayload = {
    id: existingIndex === -1 ? `admin-${centerId}` : data.admins[existingIndex].id,
    centerId: center.id,
    centerName: center.name,
    centerCode: center.code,
    centerType: center.type,
    username: center.id,
    password,
    createdAt:
      existingIndex === -1
        ? new Date().toISOString()
        : data.admins[existingIndex].createdAt,
    updatedAt: new Date().toISOString(),
  };

  if (existingIndex === -1) {
    data.admins.push(adminPayload);
  } else {
    data.admins[existingIndex] = adminPayload;
  }

  writeDB(data);

  res.json({
    id: adminPayload.id,
    role: "admin",
    centerId: adminPayload.centerId,
    centerName: adminPayload.centerName,
    centerCode: adminPayload.centerCode,
    centerType: adminPayload.centerType,
  });
});

router.get("/tokens", (req, res) => {
  const { centerId, status } = req.query;
  const data = readDB();
  let tokens = data.tokens || [];

  if (centerId) {
    tokens = tokens.filter((token) => token.centerId === centerId);
  }

  if (status) {
    const statuses = status.split(",").map((value) => value.trim());
    tokens = tokens.filter((token) => statuses.includes(token.status));
  }

  res.json(tokens);
});

const updateTokenStatus = (tokenId, nextStatus, field) => {
  const data = readDB();
  const index = data.tokens.findIndex((token) => token.id === tokenId);

  if (index === -1) {
    return null;
  }

  data.tokens[index] = {
    ...data.tokens[index],
    status: nextStatus,
    [field]: new Date().toISOString(),
  };

  writeDB(data);
  return data.tokens[index];
};

router.patch("/tokens/:id/approve", (req, res) => {
  const updated = updateTokenStatus(req.params.id, "approved", "approvedAt");
  if (!updated) {
    return res.status(404).json({ message: "Token not found" });
  }
  res.json(updated);
});

router.patch("/tokens/:id/reject", (req, res) => {
  const updated = updateTokenStatus(req.params.id, "rejected", "rejectedAt");
  if (!updated) {
    return res.status(404).json({ message: "Token not found" });
  }
  res.json(updated);
});

router.patch("/tokens/:id/clear", (req, res) => {
  const updated = updateTokenStatus(req.params.id, "cleared", "clearedAt");
  if (!updated) {
    return res.status(404).json({ message: "Token not found" });
  }
  res.json(updated);
});

router.get("/qrs", (req, res) => {
  const { centerId } = req.query;
  const data = readDB();
  let codes = data.qrCodes || [];

  if (centerId) {
    codes = codes.filter((item) => item.centerId === centerId);
  }

  res.json(codes);
});

router.post("/qrs", (req, res) => {
  const { centerId, count } = req.body;

  if (!centerId || !count) {
    return res.status(400).json({ message: "Center and count are required" });
  }

  const data = readDB();
  const total = Math.min(Math.max(Number(count) || 0, 1), 50);
  const created = [];

  for (let i = 0; i < total; i += 1) {
    const code = `qr-${centerId}-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`;
    const entry = {
      code,
      centerId,
      active: true,
      createdAt: new Date().toISOString(),
    };
    data.qrCodes.push(entry);
    created.push(entry);
  }

  writeDB(data);
  res.status(201).json(created);
});

router.patch("/qrs/:code/toggle", (req, res) => {
  const { code } = req.params;
  const data = readDB();
  const index = data.qrCodes.findIndex((item) => item.code === code);

  if (index === -1) {
    return res.status(404).json({ message: "QR code not found" });
  }

  data.qrCodes[index] = {
    ...data.qrCodes[index],
    active: !data.qrCodes[index].active,
    updatedAt: new Date().toISOString(),
  };

  writeDB(data);
  res.json(data.qrCodes[index]);
});

module.exports = router;
