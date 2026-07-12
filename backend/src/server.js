require("dotenv").config();

const app = require("./app");
const testConnection = require("./config/testConnection");

const PORT = process.env.PORT || 5000;

(async () => {

    await testConnection();

    app.listen(PORT, () => {
        console.log(`🚀 Server running on ${PORT}`);
    });

})();
