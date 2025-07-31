import express from "express";
import * as model from "./bookstore_model.mjs";
import "dotenv/config";

const app = express();
const PORT = 3001; // Different port to avoid conflicts

app.use(express.json());

// CORS middleware
app.use((req, res, next) => {
   res.header("Access-Control-Allow-Origin", "*");
   res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
   );
   res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
   );
   if (req.method === "OPTIONS") {
      res.sendStatus(200);
   } else {
      next();
   }
});

// Health check endpoint
app.get("/health", (req, res) => {
   res.json({ status: "OK", message: "Bookstore API is running" });
});

// Reset database endpoint
app.post("/api/v1/reset", async (req, res) => {
   try {
      console.log("Resetting database...");

      // Drop all tables in reverse order of dependencies
      const dropQueries = [
         "DROP TABLE IF EXISTS BookGenres",
         "DROP TABLE IF EXISTS BookAuthors",
         "DROP TABLE IF EXISTS BookLocations",
         "DROP TABLE IF EXISTS OrderItems",
         "DROP TABLE IF EXISTS Orders",
         "DROP TABLE IF EXISTS SalesRateLocations",
         "DROP TABLE IF EXISTS SLOCS",
         "DROP TABLE IF EXISTS Genres",
         "DROP TABLE IF EXISTS Authors",
         "DROP TABLE IF EXISTS Books",
         "DROP TABLE IF EXISTS Customers",
         "DROP TABLE IF EXISTS Publishers",
      ];

      for (const query of dropQueries) {
         await model.pool.query(query);
      }

      // Read and execute DDL script
      const fs = await import("fs");
      const path = await import("path");
      const ddlPath = path.join(process.cwd(), "..", "DDL.sql");
      const ddlScript = fs.readFileSync(ddlPath, "utf8");

      // Split the script into individual statements and execute them
      const statements = ddlScript.split(";").filter((stmt) => stmt.trim());
      for (const statement of statements) {
         if (statement.trim()) {
            await model.pool.query(statement);
         }
      }

      // Seed sample data
      const sampleData = [
         // Publishers
         {
            query: "INSERT INTO Publishers (publisherName) VALUES (?)",
            values: [
               ["Penguin Random House"],
               ["HarperCollins"],
               ["Simon & Schuster"],
               ["Macmillan"],
            ],
         },

         // Authors
         {
            query: "INSERT INTO Authors (firstName, middleName, lastName) VALUES (?, ?, ?)",
            values: [
               ["Toni", null, "Morrison"],
               ["Thomas", null, "Pynchon"],
               ["Stephen", "Edwin", "King"],
               ["Neil", "Richard", "Gaiman"],
            ],
         },

         // Genres
         {
            query: "INSERT INTO Genres (genreName) VALUES (?)",
            values: [
               ["Fiction"],
               ["Non-Fiction"],
               ["Science Fiction"],
               ["Fantasy"],
               ["Mystery"],
               ["Romance"],
            ],
         },

         // Sales Rate Locations
         {
            query: "INSERT INTO SalesRateLocations (taxRate, county, state) VALUES (?, ?, ?)",
            values: [
               [0.085, "Multnomah", "OR"],
               [0.0825, "Washington", "OR"],
               [0.075, "Clackamas", "OR"],
            ],
         },

         // Locations (SLOCS)
         {
            query: "INSERT INTO SLOCS (slocName) VALUES (?)",
            values: [["Main Store"], ["Warehouse A"], ["Warehouse B"]],
         },

         // Customers
         {
            query: "INSERT INTO Customers (firstName, lastName, email, phoneNumber) VALUES (?, ?, ?, ?)",
            values: [
               ["John", "Doe", "john.doe@email.com", "555-0101"],
               ["Jane", "Smith", "jane.smith@email.com", "555-0102"],
               ["Bob", "Johnson", "bob.johnson@email.com", "555-0103"],
            ],
         },

         // Books
         {
            query: "INSERT INTO Books (title, publicationDate, `isbn-10`, `isbn-13`, price, inventoryQty, publisherID, inStock) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            values: [
               [
                  "Beloved",
                  "1987-09-02",
                  "1400033411",
                  "9781400033416",
                  15.99,
                  50,
                  1,
                  1,
               ],
               [
                  "Gravity's Rainbow",
                  "1973-02-28",
                  "0140188592",
                  "9780140188599",
                  18.99,
                  30,
                  2,
                  1,
               ],
               [
                  "The Stand",
                  "1978-10-03",
                  "0385121687",
                  "9780385121685",
                  12.99,
                  75,
                  3,
                  1,
               ],
            ],
         },

         // BookAuthors relationships
         {
            query: "INSERT INTO BookAuthors (authorID, bookID) VALUES (?, ?)",
            values: [
               [1, 1],
               [2, 2],
               [3, 3],
            ],
         },

         // BookGenres relationships
         {
            query: "INSERT INTO BookGenres (bookID, genreID) VALUES (?, ?)",
            values: [
               [1, 1],
               [2, 3],
               [3, 1],
            ],
         },

         // BookLocations relationships
         {
            query: "INSERT INTO BookLocations (bookID, slocID, quantity) VALUES (?, ?, ?)",
            values: [
               [1, 1, 25],
               [1, 2, 25],
               [2, 1, 15],
               [2, 3, 15],
               [3, 1, 40],
               [3, 2, 35],
            ],
         },
      ];

      for (const data of sampleData) {
         for (const values of data.values) {
            await model.pool.query(data.query, values);
         }
      }

      console.log("Database reset complete with sample data");
      res.json({
         status: "success",
         message: "Database reset complete with sample data",
         tablesCreated: dropQueries.length,
         sampleDataInserted: sampleData.length,
      });
   } catch (error) {
      console.error("Error resetting database:", error);
      res.status(500).json({
         error: "Failed to reset database",
         details: error.message,
      });
   }
});

// Authors endpoints
app.get("/api/v1/authors", async (req, res) => {
   try {
      const authors = await model.findAllAuthors();
      res.json(authors);
   } catch (error) {
      console.error("Error fetching authors:", error);
      res.status(500).json({ error: "Internal server error" });
   }
});

app.get("/api/v1/authors/:id", async (req, res) => {
   try {
      const author = await model.findAuthorById(req.params.id);
      if (author) {
         res.json(author);
      } else {
         res.status(404).json({ error: "Author not found" });
      }
   } catch (error) {
      console.error("Error fetching author:", error);
      res.status(500).json({ error: "Internal server error" });
   }
});

app.post("/api/v1/authors", async (req, res) => {
   try {
      const author = await model.createAuthor(req.body);
      res.status(201).json(author);
   } catch (error) {
      console.error("Error creating author:", error);
      res.status(400).json({ error: "Invalid request" });
   }
});

app.put("/api/v1/authors/:id", async (req, res) => {
   try {
      const author = await model.updateAuthor(req.params.id, req.body);
      if (author) {
         res.json(author);
      } else {
         res.status(404).json({ error: "Author not found" });
      }
   } catch (error) {
      console.error("Error updating author:", error);
      res.status(400).json({ error: "Invalid request" });
   }
});

app.delete("/api/v1/authors/:id", async (req, res) => {
   try {
      const deleted = await model.deleteAuthor(req.params.id);
      if (deleted) {
         res.status(204).send();
      } else {
         res.status(404).json({ error: "Author not found" });
      }
   } catch (error) {
      console.error("Error deleting author:", error);
      res.status(500).json({ error: "Internal server error" });
   }
});

// Books endpoints
app.get("/api/v1/books", async (req, res) => {
   try {
      const books = await model.findAllBooks();
      res.json(books);
   } catch (error) {
      console.error("Error fetching books:", error);
      res.status(500).json({ error: "Internal server error" });
   }
});

app.get("/api/v1/books/:id", async (req, res) => {
   try {
      const book = await model.findBookById(req.params.id);
      if (book) {
         res.json(book);
      } else {
         res.status(404).json({ error: "Book not found" });
      }
   } catch (error) {
      console.error("Error fetching book:", error);
      res.status(500).json({ error: "Internal server error" });
   }
});

app.post("/api/v1/books", async (req, res) => {
   try {
      const book = await model.createBook(req.body);
      res.status(201).json(book);
   } catch (error) {
      console.error("Error creating book:", error);
      res.status(400).json({ error: "Invalid request" });
   }
});

app.put("/api/v1/books/:id", async (req, res) => {
   try {
      const book = await model.updateBook(req.params.id, req.body);
      if (book) {
         res.json(book);
      } else {
         res.status(404).json({ error: "Book not found" });
      }
   } catch (error) {
      console.error("Error updating book:", error);
      res.status(400).json({ error: "Invalid request" });
   }
});

app.delete("/api/v1/books/:id", async (req, res) => {
   try {
      const deleted = await model.deleteBook(req.params.id);
      if (deleted) {
         res.status(204).send();
      } else {
         res.status(404).json({ error: "Book not found" });
      }
   } catch (error) {
      console.error("Error deleting book:", error);
      res.status(500).json({ error: "Internal server error" });
   }
});

// Publishers endpoints
app.get("/api/v1/publishers", async (req, res) => {
   try {
      const publishers = await model.findAllPublishers();
      res.json(publishers);
   } catch (error) {
      console.error("Error fetching publishers:", error);
      res.status(500).json({ error: "Internal server error" });
   }
});

app.get("/api/v1/publishers/:id", async (req, res) => {
   try {
      const publisher = await model.findPublisherById(req.params.id);
      if (publisher) {
         res.json(publisher);
      } else {
         res.status(404).json({ error: "Publisher not found" });
      }
   } catch (error) {
      console.error("Error fetching publisher:", error);
      res.status(500).json({ error: "Internal server error" });
   }
});

app.post("/api/v1/publishers", async (req, res) => {
   try {
      const publisher = await model.createPublisher(req.body);
      res.status(201).json(publisher);
   } catch (error) {
      console.error("Error creating publisher:", error);
      res.status(400).json({ error: "Invalid request" });
   }
});

app.put("/api/v1/publishers/:id", async (req, res) => {
   try {
      const publisher = await model.updatePublisher(req.params.id, req.body);
      if (publisher) {
         res.json(publisher);
      } else {
         res.status(404).json({ error: "Publisher not found" });
      }
   } catch (error) {
      console.error("Error updating publisher:", error);
      res.status(400).json({ error: "Invalid request" });
   }
});

app.delete("/api/v1/publishers/:id", async (req, res) => {
   try {
      const deleted = await model.deletePublisher(req.params.id);
      if (deleted) {
         res.status(204).send();
      } else {
         res.status(404).json({ error: "Publisher not found" });
      }
   } catch (error) {
      console.error("Error deleting publisher:", error);
      res.status(500).json({ error: "Internal server error" });
   }
});

// Customers endpoints
app.get("/api/v1/customers", async (req, res) => {
   try {
      const customers = await model.findAllCustomers();
      res.json(customers);
   } catch (error) {
      console.error("Error fetching customers:", error);
      res.status(500).json({ error: "Internal server error" });
   }
});

app.get("/api/v1/customers/:id", async (req, res) => {
   try {
      const customer = await model.findCustomerById(req.params.id);
      if (customer) {
         res.json(customer);
      } else {
         res.status(404).json({ error: "Customer not found" });
      }
   } catch (error) {
      console.error("Error fetching customer:", error);
      res.status(500).json({ error: "Internal server error" });
   }
});

app.post("/api/v1/customers", async (req, res) => {
   try {
      const customer = await model.createCustomer(req.body);
      res.status(201).json(customer);
   } catch (error) {
      console.error("Error creating customer:", error);
      res.status(400).json({ error: "Invalid request" });
   }
});

app.put("/api/v1/customers/:id", async (req, res) => {
   try {
      const customer = await model.updateCustomer(req.params.id, req.body);
      if (customer) {
         res.json(customer);
      } else {
         res.status(404).json({ error: "Customer not found" });
      }
   } catch (error) {
      console.error("Error updating customer:", error);
      res.status(400).json({ error: "Invalid request" });
   }
});

app.delete("/api/v1/customers/:id", async (req, res) => {
   try {
      const deleted = await model.deleteCustomer(req.params.id);
      if (deleted) {
         res.status(204).send();
      } else {
         res.status(404).json({ error: "Customer not found" });
      }
   } catch (error) {
      console.error("Error deleting customer:", error);
      res.status(500).json({ error: "Internal server error" });
   }
});

// Orders endpoints
app.get("/api/v1/orders", async (req, res) => {
   try {
      const orders = await model.findAllOrders();
      res.json(orders);
   } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ error: "Internal server error" });
   }
});

app.get("/api/v1/orders/:id", async (req, res) => {
   try {
      const order = await model.findOrderById(req.params.id);
      if (order) {
         res.json(order);
      } else {
         res.status(404).json({ error: "Order not found" });
      }
   } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ error: "Internal server error" });
   }
});

app.post("/api/v1/orders", async (req, res) => {
   try {
      const order = await model.createOrder(req.body);
      res.status(201).json(order);
   } catch (error) {
      console.error("Error creating order:", error);
      res.status(400).json({ error: "Invalid request" });
   }
});

app.put("/api/v1/orders/:id", async (req, res) => {
   try {
      const order = await model.updateOrder(req.params.id, req.body);
      if (order) {
         res.json(order);
      } else {
         res.status(404).json({ error: "Order not found" });
      }
   } catch (error) {
      console.error("Error updating order:", error);
      res.status(400).json({ error: "Invalid request" });
   }
});

app.delete("/api/v1/orders/:id", async (req, res) => {
   try {
      const deleted = await model.deleteOrder(req.params.id);
      if (deleted) {
         res.status(204).send();
      } else {
         res.status(404).json({ error: "Order not found" });
      }
   } catch (error) {
      console.error("Error deleting order:", error);
      res.status(500).json({ error: "Internal server error" });
   }
});

// OrderItems endpoints
app.get("/api/v1/order-items", async (req, res) => {
   try {
      const orderItems = await model.findOrderItemsByOrderId(req.query.orderId);
      res.json(orderItems);
   } catch (error) {
      console.error("Error fetching order items:", error);
      res.status(500).json({ error: "Internal server error" });
   }
});

app.get("/api/v1/order-items/:id", async (req, res) => {
   try {
      const orderItem = await model.findOrderItemById(req.params.id);
      if (orderItem) {
         res.json(orderItem);
      } else {
         res.status(404).json({ error: "Order item not found" });
      }
   } catch (error) {
      console.error("Error fetching order item:", error);
      res.status(500).json({ error: "Internal server error" });
   }
});

app.post("/api/v1/order-items", async (req, res) => {
   try {
      const orderItem = await model.createOrderItem(req.body);
      res.status(201).json(orderItem);
   } catch (error) {
      console.error("Error creating order item:", error);
      res.status(400).json({ error: "Invalid request" });
   }
});

app.put("/api/v1/order-items/:id", async (req, res) => {
   try {
      const orderItem = await model.updateOrderItem(req.params.id, req.body);
      if (orderItem) {
         res.json(orderItem);
      } else {
         res.status(404).json({ error: "Order item not found" });
      }
   } catch (error) {
      console.error("Error updating order item:", error);
      res.status(400).json({ error: "Invalid request" });
   }
});

app.delete("/api/v1/order-items/:id", async (req, res) => {
   try {
      const deleted = await model.deleteOrderItem(req.params.id);
      if (deleted) {
         res.status(204).send();
      } else {
         res.status(404).json({ error: "Order item not found" });
      }
   } catch (error) {
      console.error("Error deleting order item:", error);
      res.status(500).json({ error: "Internal server error" });
   }
});

// Genres endpoints
app.get("/api/v1/genres", async (req, res) => {
   try {
      const genres = await model.findAllGenres();
      res.json(genres);
   } catch (error) {
      console.error("Error fetching genres:", error);
      res.status(500).json({ error: "Internal server error" });
   }
});

app.get("/api/v1/genres/:id", async (req, res) => {
   try {
      const genre = await model.findGenreById(req.params.id);
      if (genre) {
         res.json(genre);
      } else {
         res.status(404).json({ error: "Genre not found" });
      }
   } catch (error) {
      console.error("Error fetching genre:", error);
      res.status(500).json({ error: "Internal server error" });
   }
});

app.post("/api/v1/genres", async (req, res) => {
   try {
      const genre = await model.createGenre(req.body);
      res.status(201).json(genre);
   } catch (error) {
      console.error("Error creating genre:", error);
      res.status(400).json({ error: "Invalid request" });
   }
});

app.put("/api/v1/genres/:id", async (req, res) => {
   try {
      const genre = await model.updateGenre(req.params.id, req.body);
      if (genre) {
         res.json(genre);
      } else {
         res.status(404).json({ error: "Genre not found" });
      }
   } catch (error) {
      console.error("Error updating genre:", error);
      res.status(400).json({ error: "Invalid request" });
   }
});

app.delete("/api/v1/genres/:id", async (req, res) => {
   try {
      const deleted = await model.deleteGenre(req.params.id);
      if (deleted) {
         res.status(204).send();
      } else {
         res.status(404).json({ error: "Genre not found" });
      }
   } catch (error) {
      console.error("Error deleting genre:", error);
      res.status(500).json({ error: "Internal server error" });
   }
});

// SalesRateLocations endpoints
app.get("/api/v1/sales-rate-locations", async (req, res) => {
   try {
      const salesRateLocations = await model.findAllSalesRateLocations();
      res.json(salesRateLocations);
   } catch (error) {
      console.error("Error fetching sales rate locations:", error);
      res.status(500).json({ error: "Internal server error" });
   }
});

app.get("/api/v1/sales-rate-locations/:id", async (req, res) => {
   try {
      const salesRateLocation = await model.findSalesRateLocationById(
         req.params.id
      );
      if (salesRateLocation) {
         res.json(salesRateLocation);
      } else {
         res.status(404).json({ error: "Sales rate location not found" });
      }
   } catch (error) {
      console.error("Error fetching sales rate location:", error);
      res.status(500).json({ error: "Internal server error" });
   }
});

app.post("/api/v1/sales-rate-locations", async (req, res) => {
   try {
      const salesRateLocation = await model.createSalesRateLocation(req.body);
      res.status(201).json(salesRateLocation);
   } catch (error) {
      console.error("Error creating sales rate location:", error);
      res.status(400).json({ error: "Invalid request" });
   }
});

app.put("/api/v1/sales-rate-locations/:id", async (req, res) => {
   try {
      const salesRateLocation = await model.updateSalesRateLocation(
         req.params.id,
         req.body
      );
      if (salesRateLocation) {
         res.json(salesRateLocation);
      } else {
         res.status(404).json({ error: "Sales rate location not found" });
      }
   } catch (error) {
      console.error("Error updating sales rate location:", error);
      res.status(400).json({ error: "Invalid request" });
   }
});

app.delete("/api/v1/sales-rate-locations/:id", async (req, res) => {
   try {
      const deleted = await model.deleteSalesRateLocation(req.params.id);
      if (deleted) {
         res.status(204).send();
      } else {
         res.status(404).json({ error: "Sales rate location not found" });
      }
   } catch (error) {
      console.error("Error deleting sales rate location:", error);
      res.status(500).json({ error: "Internal server error" });
   }
});

// Locations (SLOCS) endpoints
app.get("/api/v1/locations", async (req, res) => {
   try {
      const locations = await model.findAllLocations();
      res.json(locations);
   } catch (error) {
      console.error("Error fetching locations:", error);
      res.status(500).json({ error: "Internal server error" });
   }
});

app.get("/api/v1/locations/:id", async (req, res) => {
   try {
      const location = await model.findLocationById(req.params.id);
      if (location) {
         res.json(location);
      } else {
         res.status(404).json({ error: "Location not found" });
      }
   } catch (error) {
      console.error("Error fetching location:", error);
      res.status(500).json({ error: "Internal server error" });
   }
});

app.post("/api/v1/locations", async (req, res) => {
   try {
      const location = await model.createLocation(req.body);
      res.status(201).json(location);
   } catch (error) {
      console.error("Error creating location:", error);
      res.status(400).json({ error: "Invalid request" });
   }
});

app.put("/api/v1/locations/:id", async (req, res) => {
   try {
      const location = await model.updateLocation(req.params.id, req.body);
      if (location) {
         res.json(location);
      } else {
         res.status(404).json({ error: "Location not found" });
      }
   } catch (error) {
      console.error("Error updating location:", error);
      res.status(400).json({ error: "Invalid request" });
   }
});

app.delete("/api/v1/locations/:id", async (req, res) => {
   try {
      const deleted = await model.deleteLocation(req.params.id);
      if (deleted) {
         res.status(204).send();
      } else {
         res.status(404).json({ error: "Location not found" });
      }
   } catch (error) {
      console.error("Error deleting location:", error);
      res.status(500).json({ error: "Internal server error" });
   }
});

// BookAuthors endpoints
app.get("/api/v1/book-authors", async (req, res) => {
   try {
      const bookAuthors = await model.findAllBookAuthors();
      res.json(bookAuthors);
   } catch (error) {
      console.error("Error fetching book authors:", error);
      res.status(500).json({ error: "Internal server error" });
   }
});

app.get("/api/v1/book-authors/:id", async (req, res) => {
   try {
      const bookAuthor = await model.findBookAuthorById(req.params.id);
      if (bookAuthor) {
         res.json(bookAuthor);
      } else {
         res.status(404).json({ error: "Book author not found" });
      }
   } catch (error) {
      console.error("Error fetching book author:", error);
      res.status(500).json({ error: "Internal server error" });
   }
});

app.post("/api/v1/book-authors", async (req, res) => {
   try {
      const bookAuthor = await model.createBookAuthor(req.body);
      res.status(201).json(bookAuthor);
   } catch (error) {
      console.error("Error creating book author:", error);
      res.status(400).json({ error: "Invalid request" });
   }
});

app.put("/api/v1/book-authors/:id", async (req, res) => {
   try {
      const bookAuthor = await model.updateBookAuthor(req.params.id, req.body);
      if (bookAuthor) {
         res.json(bookAuthor);
      } else {
         res.status(404).json({ error: "Book author not found" });
      }
   } catch (error) {
      console.error("Error updating book author:", error);
      res.status(400).json({ error: "Invalid request" });
   }
});

app.delete("/api/v1/book-authors/:id", async (req, res) => {
   try {
      const deleted = await model.deleteBookAuthor(req.params.id);
      if (deleted) {
         res.status(204).send();
      } else {
         res.status(404).json({ error: "Book author not found" });
      }
   } catch (error) {
      console.error("Error deleting book author:", error);
      res.status(500).json({ error: "Internal server error" });
   }
});

// BookGenres endpoints
app.get("/api/v1/book-genres", async (req, res) => {
   try {
      const bookGenres = await model.findAllBookGenres();
      res.json(bookGenres);
   } catch (error) {
      console.error("Error fetching book genres:", error);
      res.status(500).json({ error: "Internal server error" });
   }
});

app.get("/api/v1/book-genres/:id", async (req, res) => {
   try {
      const bookGenre = await model.findBookGenreById(req.params.id);
      if (bookGenre) {
         res.json(bookGenre);
      } else {
         res.status(404).json({ error: "Book genre not found" });
      }
   } catch (error) {
      console.error("Error fetching book genre:", error);
      res.status(500).json({ error: "Internal server error" });
   }
});

app.post("/api/v1/book-genres", async (req, res) => {
   try {
      const bookGenre = await model.createBookGenre(req.body);
      res.status(201).json(bookGenre);
   } catch (error) {
      console.error("Error creating book genre:", error);
      res.status(400).json({ error: "Invalid request" });
   }
});

app.put("/api/v1/book-genres/:id", async (req, res) => {
   try {
      const bookGenre = await model.updateBookGenre(req.params.id, req.body);
      if (bookGenre) {
         res.json(bookGenre);
      } else {
         res.status(404).json({ error: "Book genre not found" });
      }
   } catch (error) {
      console.error("Error updating book genre:", error);
      res.status(400).json({ error: "Invalid request" });
   }
});

app.delete("/api/v1/book-genres/:id", async (req, res) => {
   try {
      const deleted = await model.deleteBookGenre(req.params.id);
      if (deleted) {
         res.status(204).send();
      } else {
         res.status(404).json({ error: "Book genre not found" });
      }
   } catch (error) {
      console.error("Error deleting book genre:", error);
      res.status(500).json({ error: "Internal server error" });
   }
});

// BookLocations endpoints
app.get("/api/v1/book-locations", async (req, res) => {
   try {
      const bookLocations = await model.findAllBookLocations();
      res.json(bookLocations);
   } catch (error) {
      console.error("Error fetching book locations:", error);
      res.status(500).json({ error: "Internal server error" });
   }
});

app.get("/api/v1/book-locations/:id", async (req, res) => {
   try {
      const bookLocation = await model.findBookLocationById(req.params.id);
      if (bookLocation) {
         res.json(bookLocation);
      } else {
         res.status(404).json({ error: "Book location not found" });
      }
   } catch (error) {
      console.error("Error fetching book location:", error);
      res.status(500).json({ error: "Internal server error" });
   }
});

app.post("/api/v1/book-locations", async (req, res) => {
   try {
      const bookLocation = await model.createBookLocation(req.body);
      res.status(201).json(bookLocation);
   } catch (error) {
      console.error("Error creating book location:", error);
      res.status(400).json({ error: "Invalid request" });
   }
});

app.put("/api/v1/book-locations/:id", async (req, res) => {
   try {
      const bookLocation = await model.updateBookLocation(
         req.params.id,
         req.body
      );
      if (bookLocation) {
         res.json(bookLocation);
      } else {
         res.status(404).json({ error: "Book location not found" });
      }
   } catch (error) {
      console.error("Error updating book location:", error);
      res.status(400).json({ error: "Invalid request" });
   }
});

app.delete("/api/v1/book-locations/:id", async (req, res) => {
   try {
      const deleted = await model.deleteBookLocation(req.params.id);
      if (deleted) {
         res.status(204).send();
      } else {
         res.status(404).json({ error: "Book location not found" });
      }
   } catch (error) {
      console.error("Error deleting book location:", error);
      res.status(500).json({ error: "Internal server error" });
   }
});

// Customer Orders endpoints
app.get("/api/v1/customers/:customerId/orders", async (req, res) => {
   try {
      const orders = await model.findOrdersByCustomerId(req.params.customerId);
      res.json(orders);
   } catch (error) {
      console.error("Error fetching customer orders:", error);
      res.status(500).json({ error: "Internal server error" });
   }
});

// Book-specific relationships
app.get("/api/v1/books/:bookId/authors", async (req, res) => {
   try {
      const bookAuthors = await model.findBookAuthorsByBookId(
         req.params.bookId
      );
      res.json(bookAuthors);
   } catch (error) {
      console.error("Error fetching book authors:", error);
      res.status(500).json({ error: "Internal server error" });
   }
});

app.get("/api/v1/books/:bookId/genres", async (req, res) => {
   try {
      const bookGenres = await model.findBookGenresByBookId(req.params.bookId);
      res.json(bookGenres);
   } catch (error) {
      console.error("Error fetching book genres:", error);
      res.status(500).json({ error: "Internal server error" });
   }
});

app.get("/api/v1/books/:bookId/locations", async (req, res) => {
   try {
      const bookLocations = await model.findBookLocationsByBookId(
         req.params.bookId
      );
      res.json(bookLocations);
   } catch (error) {
      console.error("Error fetching book locations:", error);
      res.status(500).json({ error: "Internal server error" });
   }
});

app.listen(PORT, () => {
   console.log(`Bookstore API server listening on port ${PORT}...`);
});
