const mysql = require('mysql2/promise');

async function initializeDbConnection() {
    try {
        const connection = await mysql.createPool({
            host: 'localhost',
            user: 'your_username',
            database: 'your_database_name',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
            password: 'your_password' // It's recommended to use environment variables for sensitive data
        });
        console.log("Database connection successfully established.");
        return connection;
    } catch (error) {
        console.error("Error establishing database connection:", error);
        throw error; // Rethrow to handle it outside or fail loudly
    }
}

module.exports = initializeDbConnection();
