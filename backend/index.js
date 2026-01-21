const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./api/login_register");
const adminRoutes = require("./api/admin");
const tokenRoutes = require("./api/tokens");
const qrRoutes = require("./api/qr");
const { ensureAdmins } = require("./database/store");

const app = express();
app.set("etag", false);

app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin) {
        res.header("Access-Control-Allow-Origin", origin);
        res.header("Vary", "Origin");
        res.header("Access-Control-Allow-Credentials", "true");
        res.header(
            "Access-Control-Allow-Headers",
            "Content-Type, Authorization"
        );
        res.header(
            "Access-Control-Allow-Methods",
            "GET, POST, PUT, PATCH, DELETE, OPTIONS"
        );
    }

    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
    }

    return next();
});

app.use(cors({
    origin: true,
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/tokens", tokenRoutes);
app.use("/api/qr", qrRoutes);

ensureAdmins();

app.listen(5000, () => {
    console.log("Backend running on http://localhost:5000");
});
