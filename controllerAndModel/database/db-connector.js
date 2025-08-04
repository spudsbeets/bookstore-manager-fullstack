/**
 * @date August 4, 2025
 * @based_on The database connection module from the CS 290 Canvas Exploration for Node.js.
 *
 * @degree_of_originality The code in this file is a direct adaptation of the source code provided in the course materials for establishing a database connection. Changes were minimal and primarily involved configuring credentials.
 *
 * @source_url The CS 290 Canvas Exploration module on setting up a database connection.
 *
 * @ai_tool_usage No AI tools were used for the creation of this specific file.
 */

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
