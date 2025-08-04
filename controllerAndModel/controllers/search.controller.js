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

import db from "../database/db-connector.js";

export async function search(req, res) {
   try {
      const { q } = req.query;
      if (!q) {
         return res.status(400).json({ error: "Search query is required" });
      }

      const searchTerm = `%${q}%`;
      const query = `
      SELECT DISTINCT
        b.bookID,
        b.title,
        b.publicationDate,
        b.\`isbn-10\`,
        b.\`isbn-13\`,
        b.price,
        b.inventoryQty,
        p.publisherName AS publisher,
        GROUP_CONCAT(DISTINCT a.fullName SEPARATOR ', ') AS authors,
        GROUP_CONCAT(DISTINCT g.genreName SEPARATOR ', ') AS genres
      FROM Books b
      LEFT JOIN Publishers p ON b.publisherID = p.publisherID
      LEFT JOIN BookAuthors ba ON b.bookID = ba.bookID
      LEFT JOIN Authors a ON ba.authorID = a.authorID
      LEFT JOIN BookGenres bg ON b.bookID = bg.bookID
      LEFT JOIN Genres g ON bg.genreID = g.genreID
      WHERE b.title LIKE ? OR 
            a.fullName LIKE ? OR 
            b.\`isbn-10\` LIKE ? OR 
            b.\`isbn-13\` LIKE ?
      GROUP BY b.bookID
    `;

      const [books] = await db.query(query, [
         searchTerm,
         searchTerm,
         searchTerm,
         searchTerm,
      ]);
      res.json(books);
   } catch (error) {
      console.error("Error searching books:", error);
      res.status(500).json({ error: "Failed to search books" });
   }
}
