const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "../../database/db.json");

const registerUser = (req, res) => {
    const { name, email, mobile, password } = req.body;

    if (!name || !email || !mobile || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    let data = { users: [] };

    if (fs.existsSync(dbPath)) {
        data = JSON.parse(fs.readFileSync(dbPath, "utf-8"));
    }

    const exists = data.users.find((u) => u.email === email);
    if (exists) {
        return res.status(409).json({ message: "User already exists" });
    }

    data.users.push({
        id: Date.now(),
        name,
        email,
        mobile,
        password
    });

    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

    res.json({ message: "Account created successfully" });
};

module.exports = registerUser;
