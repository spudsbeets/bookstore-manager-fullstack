import BaseModel from "./BaseModel.js";
import pool from "../database/db-connector.js";

class BookGenresModel extends BaseModel {
   constructor() {
      super("BookGenres", "bookGenreID");
   }

   async findByBookId(bookId) {
      try {
         const query = `
        SELECT bg.bookGenreID, b.title, g.genreName AS genre
        FROM BookGenres bg
        INNER JOIN Books b ON bg.bookID = b.bookID
        INNER JOIN Genres g ON bg.genreID = g.genreID
        WHERE bg.bookID = ?
        ORDER BY g.genreName
      `;
         const [results] = await pool.query(query, [bookId]);
         return results;
      } catch (error) {
         console.error("Error finding book genres by book ID:", error);
         throw error;
      }
   }

   async findByGenreId(genreId) {
      try {
         const query = `
        SELECT bg.bookGenreID, b.title, g.genreName AS genre
        FROM BookGenres bg
        INNER JOIN Books b ON bg.bookID = b.bookID
        INNER JOIN Genres g ON bg.genreID = g.genreID
        WHERE bg.genreID = ?
        ORDER BY b.title
      `;
         const [results] = await pool.query(query, [genreId]);
         return results;
      } catch (error) {
         console.error("Error finding book genres by genre ID:", error);
         throw error;
      }
   }

   async findAll() {
      try {
         const query = `
        SELECT bg.bookGenreID, b.title, g.genreName AS genre
        FROM BookGenres bg
        INNER JOIN Books b ON bg.bookID = b.bookID
        INNER JOIN Genres g ON bg.genreID = g.genreID
        ORDER BY b.title, g.genreName
      `;
         const [results] = await pool.query(query);
         return results;
      } catch (error) {
         console.error("Error finding all book genres:", error);
         throw error;
      }
   }
}

export default new BookGenresModel();
