require("dotenv").config();

const bcrypt = require("bcrypt");
const db = require("../config/db");

const users = [
    {
        full_name: "Fleet Manager",
        email: "fleet@transit.com",
        password: "Transit@123",
        role: "FLEET_MANAGER",
    },
    {
        full_name: "Dispatcher",
        email: "dispatch@transit.com",
        password: "Transit@123",
        role: "DISPATCHER",
    },
    {
        full_name: "Safety Officer",
        email: "safety@transit.com",
        password: "Transit@123",
        role: "SAFETY_OFFICER",
    },
    {
        full_name: "Financial Analyst",
        email: "finance@transit.com",
        password: "Transit@123",
        role: "FINANCIAL_ANALYST",
    },
];

const seedUsers = async () => {
    try {
        console.log("🌱 Seeding Users...\n");

        for (const user of users) {

            // Check if user already exists
            const [existingUser] = await db.query(
                "SELECT id FROM users WHERE email = ?",
                [user.email]
            );

            if (existingUser.length > 0) {
                console.log(`⚠️  ${user.email} already exists`);
                continue;
            }

            // Hash Password
            const hashedPassword = await bcrypt.hash(user.password, 10);

            // Insert User
            await db.query(
                `
                INSERT INTO users
                (full_name, email, password, role)
                VALUES (?, ?, ?, ?)
                `,
                [
                    user.full_name,
                    user.email,
                    hashedPassword,
                    user.role,
                ]
            );

            console.log(`✅ ${user.role} created`);
        }

        console.log("\n🎉 Database Seed Completed Successfully!");

        process.exit(0);

    } catch (error) {

        console.error("\n❌ Seed Failed");
        console.error(error);

        process.exit(1);
    }
};

seedUsers();