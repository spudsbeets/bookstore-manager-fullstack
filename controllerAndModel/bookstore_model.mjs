import pool from './database/db-connector.js';

// Export pool for direct database access
export { pool };

// Generic CRUD operations
export async function findAll(tableName, whereClause = '') {
    try {
        const [rows] = await pool.query(`SELECT * FROM ${tableName} ${whereClause}`);
        return rows;
    } catch (error) {
        console.error(`Error finding all ${tableName}:`, error);
        throw error;
    }
}

export async function findById(tableName, id, idColumn = 'id') {
    try {
        const [rows] = await pool.query(`SELECT * FROM ${tableName} WHERE ${idColumn} = ?`, [id]);
        return rows.length > 0 ? rows[0] : null;
    } catch (error) {
        console.error(`Error finding ${tableName} by ID:`, error);
        throw error;
    }
}

export async function create(tableName, data) {
    try {
        const columns = Object.keys(data).join(', ');
        const placeholders = Object.keys(data).map(() => '?').join(', ');
        const values = Object.values(data);
        
        const [result] = await pool.query(
            `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`,
            values
        );
        
        return { id: result.insertId, ...data };
    } catch (error) {
        console.error(`Error creating ${tableName}:`, error);
        throw error;
    }
}

export async function update(tableName, id, data, idColumn = 'id') {
    try {
        const setClause = Object.keys(data).map(key => `${key} = ?`).join(', ');
        const values = [...Object.values(data), id];
        
        const [result] = await pool.query(
            `UPDATE ${tableName} SET ${setClause} WHERE ${idColumn} = ?`,
            values
        );
        
        if (result.affectedRows === 0) {
            return null;
        }
        
        return { id, ...data };
    } catch (error) {
        console.error(`Error updating ${tableName}:`, error);
        throw error;
    }
}

export async function deleteById(tableName, id, idColumn = 'id') {
    try {
        const [result] = await pool.query(
            `DELETE FROM ${tableName} WHERE ${idColumn} = ?`,
            [id]
        );
        
        return result.affectedRows > 0;
    } catch (error) {
        console.error(`Error deleting ${tableName}:`, error);
        throw error;
    }
}

// Specific entity operations

// Authors
export async function findAllAuthors() {
    return await findAll('Authors');
}

export async function findAuthorById(id) {
    return await findById('Authors', id, 'authorID');
}

export async function createAuthor(data) {
    return await create('Authors', data);
}

export async function updateAuthor(id, data) {
    return await update('Authors', id, data, 'authorID');
}

export async function deleteAuthor(id) {
    return await deleteById('Authors', id, 'authorID');
}

// Books
export async function findAllBooks() {
    const [rows] = await pool.query(`
        SELECT b.*, p.publisherName 
        FROM Books b 
        LEFT JOIN Publishers p ON b.publisherID = p.publisherID
    `);
    return rows;
}

export async function findBookById(id) {
    const [rows] = await pool.query(`
        SELECT b.*, p.publisherName 
        FROM Books b 
        LEFT JOIN Publishers p ON b.publisherID = p.publisherID
        WHERE b.bookID = ?
    `, [id]);
    return rows.length > 0 ? rows[0] : null;
}

export async function createBook(data) {
    return await create('Books', data);
}

export async function updateBook(id, data) {
    return await update('Books', id, data, 'bookID');
}

export async function deleteBook(id) {
    return await deleteById('Books', id, 'bookID');
}

// Publishers
export async function findAllPublishers() {
    return await findAll('Publishers');
}

export async function findPublisherById(id) {
    return await findById('Publishers', id, 'publisherID');
}

export async function createPublisher(data) {
    return await create('Publishers', data);
}

export async function updatePublisher(id, data) {
    return await update('Publishers', id, data, 'publisherID');
}

export async function deletePublisher(id) {
    return await deleteById('Publishers', id, 'publisherID');
}

// Customers
export async function findAllCustomers() {
    return await findAll('Customers');
}

export async function findCustomerById(id) {
    return await findById('Customers', id, 'customerID');
}

export async function createCustomer(data) {
    return await create('Customers', data);
}

export async function updateCustomer(id, data) {
    return await update('Customers', id, data, 'customerID');
}

export async function deleteCustomer(id) {
    return await deleteById('Customers', id, 'customerID');
}

// Orders
export async function findAllOrders() {
    const [rows] = await pool.query(`
        SELECT o.*, c.firstName, c.lastName, 
               CONCAT(c.firstName, ' ', c.lastName) as customerName,
               s.county, s.state
        FROM Orders o
        LEFT JOIN Customers c ON o.customerID = c.customerID
        LEFT JOIN SalesRateLocations s ON o.salesRateID = s.salesRateID
    `);
    return rows;
}

export async function findOrderById(id) {
    const [rows] = await pool.query(`
        SELECT o.*, c.firstName, c.lastName, 
               CONCAT(c.firstName, ' ', c.lastName) as customerName,
               s.county, s.state
        FROM Orders o
        LEFT JOIN Customers c ON o.customerID = c.customerID
        LEFT JOIN SalesRateLocations s ON o.salesRateID = s.salesRateID
        WHERE o.orderID = ?
    `, [id]);
    return rows.length > 0 ? rows[0] : null;
}

export async function createOrder(data) {
    return await create('Orders', data);
}

export async function updateOrder(id, data) {
    return await update('Orders', id, data, 'orderID');
}

export async function deleteOrder(id) {
    return await deleteById('Orders', id, 'orderID');
}

// OrderItems
export async function findOrderItemsByOrderId(orderId) {
    const [rows] = await pool.query(`
        SELECT oi.*, b.title as bookTitle
        FROM OrderItems oi
        LEFT JOIN Books b ON oi.bookID = b.bookID
        WHERE oi.orderID = ?
    `, [orderId]);
    return rows;
}

export async function findOrderItemById(id) {
    const [rows] = await pool.query(`
        SELECT oi.*, b.title as bookTitle
        FROM OrderItems oi
        LEFT JOIN Books b ON oi.bookID = b.bookID
        WHERE oi.orderItemID = ?
    `, [id]);
    return rows.length > 0 ? rows[0] : null;
}

export async function createOrderItem(data) {
    return await create('OrderItems', data);
}

export async function updateOrderItem(id, data) {
    return await update('OrderItems', id, data, 'orderItemID');
}

export async function deleteOrderItem(id) {
    return await deleteById('OrderItems', id, 'orderItemID');
}

// Genres
export async function findAllGenres() {
    return await findAll('Genres');
}

export async function findGenreById(id) {
    return await findById('Genres', id, 'genreID');
}

export async function createGenre(data) {
    return await create('Genres', data);
}

export async function updateGenre(id, data) {
    return await update('Genres', id, data, 'genreID');
}

export async function deleteGenre(id) {
    return await deleteById('Genres', id, 'genreID');
}

// SalesRateLocations
export async function findAllSalesRateLocations() {
    return await findAll('SalesRateLocations');
}

export async function findSalesRateLocationById(id) {
    return await findById('SalesRateLocations', id, 'salesRateID');
}

export async function createSalesRateLocation(data) {
    return await create('SalesRateLocations', data);
}

export async function updateSalesRateLocation(id, data) {
    return await update('SalesRateLocations', id, data, 'salesRateID');
}

export async function deleteSalesRateLocation(id) {
    return await deleteById('SalesRateLocations', id, 'salesRateID');
}

// Locations (SLOCS)
export async function findAllLocations() {
    return await findAll('SLOCS');
}

export async function findLocationById(id) {
    return await findById('SLOCS', id, 'slocID');
}

export async function createLocation(data) {
    return await create('SLOCS', data);
}

export async function updateLocation(id, data) {
    return await update('SLOCS', id, data, 'slocID');
}

export async function deleteLocation(id) {
    return await deleteById('SLOCS', id, 'slocID');
}

// BookAuthors
export async function findBookAuthorsByBookId(bookId) {
    const [rows] = await pool.query(`
        SELECT ba.*, a.firstName, a.lastName, a.fullName,
               b.title as bookTitle
        FROM BookAuthors ba
        LEFT JOIN Authors a ON ba.authorID = a.authorID
        LEFT JOIN Books b ON ba.bookID = b.bookID
        WHERE ba.bookID = ?
    `, [bookId]);
    return rows;
}

export async function findAllBookAuthors() {
    const [rows] = await pool.query(`
        SELECT ba.*, a.firstName, a.lastName, a.fullName,
               b.title as bookTitle
        FROM BookAuthors ba
        LEFT JOIN Authors a ON ba.authorID = a.authorID
        LEFT JOIN Books b ON ba.bookID = b.bookID
    `);
    return rows;
}

export async function findBookAuthorById(id) {
    const [rows] = await pool.query(`
        SELECT ba.*, a.firstName, a.lastName, a.fullName,
               b.title as bookTitle
        FROM BookAuthors ba
        LEFT JOIN Authors a ON ba.authorID = a.authorID
        LEFT JOIN Books b ON ba.bookID = b.bookID
        WHERE ba.bookAuthorID = ?
    `, [id]);
    return rows.length > 0 ? rows[0] : null;
}

export async function createBookAuthor(data) {
    return await create('BookAuthors', data);
}

export async function updateBookAuthor(id, data) {
    return await update('BookAuthors', id, data, 'bookAuthorID');
}

export async function deleteBookAuthor(id) {
    return await deleteById('BookAuthors', id, 'bookAuthorID');
}

// BookGenres
export async function findBookGenresByBookId(bookId) {
    const [rows] = await pool.query(`
        SELECT bg.*, g.genreName,
               b.title as bookTitle
        FROM BookGenres bg
        LEFT JOIN Genres g ON bg.genreID = g.genreID
        LEFT JOIN Books b ON bg.bookID = b.bookID
        WHERE bg.bookID = ?
    `, [bookId]);
    return rows;
}

export async function findAllBookGenres() {
    const [rows] = await pool.query(`
        SELECT bg.*, g.genreName,
               b.title as bookTitle
        FROM BookGenres bg
        LEFT JOIN Genres g ON bg.genreID = g.genreID
        LEFT JOIN Books b ON bg.bookID = b.bookID
    `);
    return rows;
}

export async function findBookGenreById(id) {
    const [rows] = await pool.query(`
        SELECT bg.*, g.genreName,
               b.title as bookTitle
        FROM BookGenres bg
        LEFT JOIN Genres g ON bg.genreID = g.genreID
        LEFT JOIN Books b ON bg.bookID = b.bookID
        WHERE bg.bookGenreID = ?
    `, [id]);
    return rows.length > 0 ? rows[0] : null;
}

export async function createBookGenre(data) {
    return await create('BookGenres', data);
}

export async function updateBookGenre(id, data) {
    return await update('BookGenres', id, data, 'bookGenreID');
}

export async function deleteBookGenre(id) {
    return await deleteById('BookGenres', id, 'bookGenreID');
}

// BookLocations
export async function findBookLocationsByBookId(bookId) {
    const [rows] = await pool.query(`
        SELECT bl.*, s.slocName as locationName,
               b.title as bookTitle
        FROM BookLocations bl
        LEFT JOIN SLOCS s ON bl.slocID = s.slocID
        LEFT JOIN Books b ON bl.bookID = b.bookID
        WHERE bl.bookID = ?
    `, [bookId]);
    return rows;
}

export async function findAllBookLocations() {
    const [rows] = await pool.query(`
        SELECT bl.*, s.slocName as locationName,
               b.title as bookTitle
        FROM BookLocations bl
        LEFT JOIN SLOCS s ON bl.slocID = s.slocID
        LEFT JOIN Books b ON bl.bookID = b.bookID
    `);
    return rows;
}

export async function findBookLocationById(id) {
    const [rows] = await pool.query(`
        SELECT bl.*, s.slocName as locationName,
               b.title as bookTitle
        FROM BookLocations bl
        LEFT JOIN SLOCS s ON bl.slocID = s.slocID
        LEFT JOIN Books b ON bl.bookID = b.bookID
        WHERE bl.bookLocationID = ?
    `, [id]);
    return rows.length > 0 ? rows[0] : null;
}

export async function createBookLocation(data) {
    return await create('BookLocations', data);
}

export async function updateBookLocation(id, data) {
    return await update('BookLocations', id, data, 'bookLocationID');
}

export async function deleteBookLocation(id) {
    return await deleteById('BookLocations', id, 'bookLocationID');
}

// Customer Orders (for customer-specific orders)
export async function findOrdersByCustomerId(customerId) {
    const [rows] = await pool.query(`
        SELECT o.*, c.firstName, c.lastName, 
               CONCAT(c.firstName, ' ', c.lastName) as customerName,
               s.county, s.state
        FROM Orders o
        LEFT JOIN Customers c ON o.customerID = c.customerID
        LEFT JOIN SalesRateLocations s ON o.salesRateID = s.salesRateID
        WHERE o.customerID = ?
    `, [customerId]);
    return rows;
} 