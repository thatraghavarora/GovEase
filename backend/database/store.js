const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "db.json");
const centersPath = path.join(
  __dirname,
  "../../frontend/govease/src/data/centers.json"
);

const readJson = (filePath, fallback) => {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch (error) {
    return fallback;
  }
};

const writeJson = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

const loadCenters = () => readJson(centersPath, []);

const readDB = () => {
  const data = readJson(dbPath, {
    users: [],
    admins: [],
    tokens: [],
    qrCodes: [],
    counters: {},
  });

  data.users = data.users || [];
  data.admins = data.admins || [];
  data.tokens = data.tokens || [];
  data.qrCodes = data.qrCodes || [];
  data.counters = data.counters || {};

  return data;
};

const writeDB = (data) => writeJson(dbPath, data);

const ensureAdmins = () => {
  const centers = loadCenters();
  const data = readDB();
  let updated = false;

  centers.forEach((center) => {
    const exists = data.admins.some((admin) => admin.centerId === center.id);
    if (!exists) {
      data.admins.push({
        id: `admin-${center.id}`,
        centerId: center.id,
        centerName: center.name,
        centerCode: center.code,
        centerType: center.type,
        username: center.id,
        password: center.code,
        createdAt: new Date().toISOString(),
      });
      updated = true;
    }
  });

  if (updated) {
    writeDB(data);
  }

  return data;
};

module.exports = {
  readDB,
  writeDB,
  ensureAdmins,
  loadCenters,
};
