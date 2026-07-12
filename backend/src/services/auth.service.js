const db = require("../config/db");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/jwt");

const login = async (email, password, role) => {

    const [rows] = await db.query(
        "SELECT * FROM users WHERE email = ?",
        [email]
    );

    if (rows.length === 0) {
        throw new Error("Invalid Email");
    }

    const user = rows[0];

    if (!user.is_active) {
        throw new Error("Account Disabled");
    }

    const isMatch = await bcrypt.compare(
        password,
        user.password
    );

    if (!isMatch) {
        throw new Error("Invalid Password");
    }

    if (user.role !== role) {
        throw new Error("Invalid Role");
    }

    const token = generateToken(user);

    return {
        token,
        user: {
            id: user.id,
            full_name: user.full_name,
            email: user.email,
            role: user.role
        }
    };
};

module.exports = {
    login
};
