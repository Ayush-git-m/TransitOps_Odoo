const express = require("express");

const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");


const {
    login
} = require("../controllers/auth.controller");

router.post("/login", login);

router.get("/me", authMiddleware, (req, res) => {
    res.json({
        success: true,
        user: req.user
    });
});

module.exports = router;