const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "../../database/db.json");

const loginUser = (req, res) => {
    const { email, password } = req.body;

    const data = JSON.parse(fs.readFileSync(dbPath, "utf-8"));

    const user = data.users.find(
        (u) => u.email === email && u.password === password
    );

    if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    /* ✅ SET COOKIE */
    res.cookie("user", JSON.stringify({
        id: user.id,
        email: user.email,
        name: user.name
    }), {
        httpOnly: false,   // frontend can read
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    res.json({ message: "Login successful" });
};

module.exports = loginUser;
