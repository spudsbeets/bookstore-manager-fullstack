// Get an instance of mysql we can use in the app
import mysql from 'mysql2'

// Create a 'connection pool' using the provided credentials for local Docker MySQL
const pool = mysql.createPool({
    waitForConnections: true,
    connectionLimit   : 10,
    host              : 'localhost',
    user              : 'root',
    password          : 'secretpassword',
    database          : 'demo'
}).promise(); // This makes it so we can use async / await rather than callbacks

// Export it for use in our application
export default pool;