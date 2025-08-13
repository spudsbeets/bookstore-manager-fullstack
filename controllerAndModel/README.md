# Bookstore Manager Backend

A Node.js/Express.js backend API for the Bookstore Manager application, providing RESTful endpoints for managing books, customers, orders, and inventory with automatic triggers and stored procedures.

```javascript
/**
 * @date August 4, 2025
 * @based_on The custom routing architecture designed for this project.
 *
 * @degree_of_originality The routing structure is original work, created to map API endpoints to the corresponding controller functions. It follows standard Express.js routing patterns but is tailored to the specific needs of this application.
 *
 * @source_url N/A - This routing implementation is based on the project's unique requirements.
 *
 * @ai_tool_usage The route files were generated using Cursor, an AI code editor, based on the defined API endpoints and controller structure. The generated code was then reviewed and refined.
 */
```

## 🚀 Features

-  **RESTful API**: Complete CRUD operations for all entities
-  **Database Triggers**: Automatic inventory calculation and updates
-  **Stored Procedures**: Complex business logic in MariaDB/MySQL
-  **Data Validation**: Input validation and error handling
-  **Database Reset**: Complete database recreation with sample data
-  **MariaDB Compatibility**: Optimized for MariaDB with fallbacks for MySQL

## 🛠️ Tech Stack

-  **Runtime**: Node.js 18+
-  **Framework**: Express.js
-  **Database**: MariaDB/MySQL
-  **Database Driver**: mysql2
-  **Validation**: Built-in input validation
-  **Error Handling**: Comprehensive error responses
-  **CORS**: Cross-origin resource sharing enabled

## 📋 Prerequisites

-  Node.js 18+
-  npm or yarn
-  MariaDB or MySQL database server
-  Database credentials (see configuration section)

## 🚀 Quick Start

1. **Navigate to backend directory**

   ```bash
   cd controllerAndModel
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure database connection**
   Update the database configuration in `server.js`:

   ```javascript
   const pool = mysql.createPool({
      host: "your-database-host",
      user: "your-username",
      password: "your-password",
      database: "your-database-name",
      // ... other options
   });
   ```

4. **Start the server**

   ```bash
   node server.js
   ```

5. **Verify server is running**
   ```bash
   curl http://localhost:60730/api/v1/health
   ```

## 🗄️ Database Setup

### Initial Database Creation

1. **Create database**

   ```sql
   CREATE DATABASE bookstore_manager;
   USE bookstore_manager;
   ```

2. **Run the reset script**

   ```sql
   SOURCE reset.SQL;
   ```

   This will:

   -  Create all tables with proper relationships
   -  Set up stored procedures and triggers
   -  Insert sample data
   -  Create views for common queries

### Database Reset

To completely reset the database with fresh data:

```bash
# Via API endpoint
curl -X POST http://localhost:60730/api/v1/reset

# Or directly in database
CALL sp_load_bookdb();
```

## 📁 Project Structure

```
controllerAndModel/
├── controllers/          # API endpoint controllers
│   ├── books.controller.js
│   ├── customers.controller.js
│   ├── orders.controller.js
│   └── ...
├── models/              # Database interaction models
│   ├── BooksModel.js
│   ├── CustomersModel.js
│   ├── OrdersModel.js
│   └── ...
├── server.js            # Main server file
├── reset.SQL            # Complete database schema and data
├── PL.sql               # Stored procedures and functions
├── DML.sql              # Data manipulation queries
└── package.json         # Dependencies and scripts
```

## 🔧 Available Scripts

-  `node server.js` - Start the development server
-  `npm start` - Start the server (if configured in package.json)
-  `npm install` - Install dependencies

## 🌐 API Endpoints

### Base URL

```
http://localhost:60730/api/v1
```

### Available Endpoints

#### Books

-  `GET /books` - Get all books
-  `GET /books/:id` - Get book by ID
-  `POST /books` - Create new book
-  `PUT /books/:id` - Update book
-  `DELETE /books/:id` - Delete book

#### Customers

-  `GET /customers` - Get all customers
-  `GET /customers/:id` - Get customer by ID
-  `POST /customers` - Create new customer
-  `PUT /customers/:id` - Update customer
-  `DELETE /customers/:id` - Delete customer

#### Orders

-  `GET /orders` - Get all orders
-  `GET /orders/:id` - Get order by ID
-  `POST /orders` - Create new order
-  `PUT /orders/:id` - Update order
-  `DELETE /orders/:id` - Delete order

#### Database Management

-  `POST /reset` - Reset entire database
-  `GET /health` - Health check endpoint

## 🗃️ Database Schema

### Core Tables

-  **Books**: Book information and metadata
-  **Customers**: Customer details and contact info
-  **Orders**: Customer orders and order items
-  **Authors**: Author information
-  **Genres**: Book genre categories
-  **Publishers**: Publisher information
-  **BookLocations**: Storage location quantities
-  **SalesRateLocations**: Location-specific pricing

### Key Relationships

-  Books ↔ Authors (Many-to-Many)
-  Books ↔ Genres (Many-to-Many)
-  Books ↔ BookLocations (One-to-Many)
-  Customers ↔ Orders (One-to-Many)
-  Orders ↔ OrderItems (One-to-Many)

## 🔄 Database Triggers

### Inventory Management

The system uses automatic triggers to maintain book inventory quantities:

-  **`after_booklocation_insert`**: Updates book inventory when locations are added
-  **`after_booklocation_update`**: Updates book inventory when location quantities change
-  **`after_booklocation_delete`**: Updates book inventory when locations are removed

### Function

-  **`CalculateBookInventory(book_id)`**: Calculates total inventory for a specific book

## 📊 Stored Procedures

### Core CRUD Operations

-  **`sp_dynamic_create_books`**: Creates books with validation
-  **`sp_dynamic_update_books`**: Updates books with validation
-  **`sp_dynamic_create_customers`**: Creates customers with validation
-  **`sp_dynamic_update_customers`**: Updates customers with validation
-  **`sp_dynamic_create_orders`**: Creates orders with validation
-  **`sp_dynamic_update_orders`**: Updates orders with validation

### Specialized Procedures

-  **`sp_deleteCustomer`**: Deletes customers with order validation
-  **`sp_load_bookdb`**: Loads sample data and initializes database
-  **`sp_create_inventory_triggers`**: Sets up inventory management triggers

## 🔒 Data Validation

### Input Validation

-  **Required Fields**: Title, publication date, price for books
-  **Data Types**: Proper type checking for all inputs
-  **Business Rules**: Validation of business logic constraints

### Error Handling

-  **HTTP Status Codes**: Proper status codes for different error types
-  **Error Messages**: Descriptive error messages for debugging
-  **Validation Errors**: Specific feedback for form validation issues

## 🚨 Error Handling

### Error Response Format

```json
{
   "error": "Error message",
   "message": "Detailed description",
   "status": 400
}
```

### Common Error Codes

-  `400`: Bad Request (validation errors)
-  `404`: Not Found (resource doesn't exist)
-  `500`: Internal Server Error (server issues)

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=bookstore_manager
DB_PORT=3306
PORT=60730
```

### Database Connection Options

```javascript
const pool = mysql.createPool({
   waitForConnections: true,
   connectionLimit: 10,
   host: process.env.DB_HOST || "localhost",
   user: process.env.DB_USER || "root",
   password: process.env.DB_PASSWORD || "",
   database: process.env.DB_NAME || "bookstore_manager",
   connectTimeout: 60000,
   acquireTimeout: 60000,
   timeout: 60000,
   reconnect: true,
});
```

## 🧪 Testing

### Manual Testing

```bash
# Test health endpoint
curl http://localhost:60730/api/v1/health

# Test database reset
curl -X POST http://localhost:60730/api/v1/reset

# Test book creation
curl -X POST http://localhost:60730/api/v1/books \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Book","publicationDate":"2024-01-01","price":"19.99"}'
```

### Database Testing

```sql
-- Test inventory trigger
INSERT INTO BookLocations (bookID, slocID, quantity) VALUES (1, 1, 10);

-- Verify inventory updated
SELECT bookID, title, inventoryQty FROM Books WHERE bookID = 1;
```

## 🚀 Deployment

### Production Considerations

1. **Environment Variables**: Use production database credentials
2. **Database Security**: Restrict database user permissions
3. **CORS Configuration**: Limit allowed origins
4. **Rate Limiting**: Implement API rate limiting
5. **Logging**: Add comprehensive logging
6. **Monitoring**: Set up health checks and monitoring

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 60730
CMD ["node", "server.js"]
```

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Failed**

   -  Verify database server is running
   -  Check credentials and database name
   -  Ensure database exists

2. **Port Already in Use**

   -  Change port in server.js
   -  Kill existing process: `lsof -ti:60730 | xargs kill`

3. **Stored Procedure Errors**

   -  Ensure MariaDB/MySQL version compatibility
   -  Check syntax in PL.sql
   -  Verify database permissions

4. **Trigger Not Working**
   -  Check if triggers exist: `SHOW TRIGGERS;`
   -  Verify function exists: `SHOW FUNCTION STATUS;`
   -  Run reset endpoint to recreate triggers

### Debug Mode

Enable detailed logging by setting:

```javascript
const DEBUG = true; // In server.js
```

## 🤖 AI-Assisted Development

This backend was developed with assistance from **Cursor AI**, an AI-powered coding assistant. The AI helped with:

-  **Database Design**: Schema optimization and relationship modeling
-  **Stored Procedures**: Complex business logic implementation
-  **API Design**: RESTful endpoint structure and validation
-  **Error Handling**: Comprehensive error management
-  **MariaDB Compatibility**: Resolving compatibility issues
-  **Trigger Implementation**: Inventory management automation
-  **Code Optimization**: Performance and maintainability improvements

**Note**: While AI assistance was used for development, all final code has been reviewed, tested, and customized for this specific bookstore management application.

## 📖 External Code References

The following external resources were referenced during development:

-  **Express.js**: [Official Documentation](https://expressjs.com/) - Web framework implementation
-  **MySQL2**: [GitHub Repository](https://github.com/sidorares/node-mysql2) - Database driver
-  **MariaDB**: [Official Documentation](https://mariadb.org/kb/en/) - Database compatibility
-  **Node.js**: [Official Documentation](https://nodejs.org/docs/) - Runtime environment

## 📚 Additional Resources

-  [Express.js Documentation](https://expressjs.com/)
-  [MySQL2 Documentation](https://github.com/sidorares/node-mysql2)
-  [MariaDB Documentation](https://mariadb.org/kb/en/)
-  [Node.js Documentation](https://nodejs.org/docs/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Note**: This backend requires a running MariaDB/MySQL database. Ensure the database is properly configured before starting the server.
