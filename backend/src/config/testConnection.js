const db = require("./db");

const testConnection = async () => {
    try {
        const connection = await db.getConnection();

        console.log("✅ Connected to TiDB Cloud");

        connection.release();

    } catch (err) {
        console.error("❌ Database Connection Failed");
        console.error(err);   // <-- pura error print hoga
        process.exit(1);
    }
};

module.exports = testConnection;
