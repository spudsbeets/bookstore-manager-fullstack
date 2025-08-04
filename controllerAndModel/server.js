/**
 * @date August 4, 2025
 * @based_on The custom backend architecture designed for this project, which utilizes Express.js routes and routers to handle API requests.
 *
 * @degree_of_originality The routing implementation is original work, designed to map HTTP requests to the appropriate controller logic. While it uses standard Express.js conventions, the specific structure and endpoint organization are unique to this application's architecture.
 *
 * @source_url N/A - This implementation is based on the project's custom architecture.
 *
 * @ai_tool_usage The route files were scaffolded using Cursor, an AI code editor, based on the defined API endpoints and controller structure. The generated code was then reviewed and customized.
 */
// Express
import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const PORT = 3001;

// Database
import db from "./database/db-connector.js";

// Import routes
import welcomeRouter from "./routes/welcome.routes.js";
import booksRouter from "./routes/books.routes.js";
import authorsRouter from "./routes/authors.routes.js";
import publishersRouter from "./routes/publishers.routes.js";
import customersRouter from "./routes/customers.routes.js";
import genresRouter from "./routes/genres.routes.js";
import ordersRouter from "./routes/orders.routes.js";
import salesRateLocationsRouter from "./routes/salesRateLocations.routes.js";
import locationsRouter from "./routes/locations.routes.js";
import bookAuthorsRouter from "./routes/bookAuthors.routes.js";
import bookGenresRouter from "./routes/bookGenres.routes.js";
import bookLocationsRouter from "./routes/bookLocations.routes.js";
import orderItemsRouter from "./routes/orderItems.routes.js";
import searchRouter from "./routes/search.routes.js";

// CORS middleware for frontend communication
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

// ########################################
// ########## API ROUTES - /api/v1

// Health check endpoint
app.get("/health", (req, res) => {
   res.json({ status: "OK", message: "Bookstore API is running" });
});

// Reset database endpoint
app.post("/api/v1/reset", async (req, res) => {
   try {
      console.log("Resetting database...");

      const ddlPath = path.join(__dirname, "..", "reset.sql");
      const ddlScript = fs.readFileSync(ddlPath, "utf8");

      // Split the script into individual statements and execute them
      const statements = ddlScript.split(";").filter((stmt) => stmt.trim());
      for (const statement of statements) {
         if (statement.trim()) {
            await db.query(statement);
         }
      }

      console.log("Database reset complete with sample data from DDL.sql");
      res.json({
         status: "success",
         message: "Database reset complete with sample data from DDL.sql",
         tablesCreated: "From DDL.sql",
         sampleDataInserted: "From DDL.sql file",
      });
   } catch (error) {
      console.error("Error resetting database:", error);
      res.status(500).json({
         error: "Failed to reset database",
         details: error.message,
      });
   }
});

// Welcome route
app.use("/", welcomeRouter);

// API routes
app.use("/api/v1/books", booksRouter);
app.use("/api/v1/authors", authorsRouter);
app.use("/api/v1/publishers", publishersRouter);
app.use("/api/v1/customers", customersRouter);
app.use("/api/v1/genres", genresRouter);
app.use("/api/v1/orders", ordersRouter);
app.use("/api/v1/sales-rates", salesRateLocationsRouter);
app.use("/api/v1/locations", locationsRouter);
app.use("/api/v1/book-authors", bookAuthorsRouter);
app.use("/api/v1/book-genres", bookGenresRouter);
app.use("/api/v1/book-locations", bookLocationsRouter);
app.use("/api/v1/order-items", orderItemsRouter);
app.use("/api/v1/search", searchRouter);

// ########################################
// ########## LISTENER

app.listen(PORT, function () {
   console.log(
      "Express started on http://localhost:" +
         PORT +
         "; press Ctrl-C to terminate."
   );
});
