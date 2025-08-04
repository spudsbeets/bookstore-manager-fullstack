/**
 * @date August 4, 2025
 * @based_on The Node.js project architecture, including the controller and model structure, from the CS 290 course materials.
 *
 * @degree_of_originality The foundational project architecture, which separates concerns into `controllers`, `models`, and `database` modules, is based on the examples and starter code provided in the CS 290 coursework. The specific implementation of each model (e.g., AuthorsModel.js, BooksModel.js) and controller (e.g., authors.controller.js, books.controller.js) to handle the application's unique business logic and database interactions is original work.
 *
 * @source_url The architectural concepts and structure were derived from course modules and examples, similar to those found at https://canvas.oregonstate.edu/courses/1967288/pages/exploration-designing-web-apps-using-mvc-and-rest-api?module_item_id=24465416
 *
 * @ai_tool_usage The controllers were generated using Cursor, an AI code editor. My own controller was provided as a template and schema for the generation, and I subsequently refined the output.
 */

export async function welcome(req, res) {
   res.json({
      message: "Welcome to the Bookstore Management API",
      version: "v1",
      endpoints: {
         health: "/health",
         reset: "/api/v1/reset",
         books: "/api/v1/books",
         authors: "/api/v1/authors",
         publishers: "/api/v1/publishers",
         customers: "/api/v1/customers",
         genres: "/api/v1/genres",
         orders: "/api/v1/orders",
         salesRates: "/api/v1/sales-rates",
         locations: "/api/v1/locations",
         bookAuthors: "/api/v1/book-authors",
         bookGenres: "/api/v1/book-genres",
         orderItems: "/api/v1/order-items",
         search: "/api/v1/search",
      },
   });
}
