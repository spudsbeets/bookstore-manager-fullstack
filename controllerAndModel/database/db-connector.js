// File: database/db-connector.js

// Get an instance of mysql we can use in the app
import mysql from "mysql2";

// Create a 'connection pool' using the provided credentials for local Docker MySQL
const pool = mysql
   .createPool({
      waitForConnections: true,
      connectionLimit: 10,
      host: "127.0.0.1",
      user: "root",
      password: "secretpassword",
      database: "demo",
      connectTimeout: 60000,
   })
   .promise(); // This makes it so we can use async / await rather than callbacks

// Export it for use in our application
export default pool;
