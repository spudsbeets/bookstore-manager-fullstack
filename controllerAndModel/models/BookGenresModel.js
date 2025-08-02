import BaseModel from "./BaseModel.js";
import pool from "../database/db-connector.js";

class BookGenresModel extends BaseModel {
   constructor() {
      super("BookGenres", "bookGenreID");
   }

   async create(data) {
      try {
         // For BookGenres, we need to find the bookID and genreID from the title and genre names
         const { title, genre } = data;

         // Find the bookID by title
         const [bookResult] = await pool.query(
            "SELECT bookID FROM Books WHERE title = ?",
            [title]
         );

         if (bookResult.length === 0) {
            throw new Error(`Book with title '${title}' not found`);
         }

         const bookID = bookResult[0].bookID;

         // Find the genreID by genre name
         const [genreResult] = await pool.query(
            "SELECT genreID FROM Genres WHERE genreName = ?",
            [genre]
         );

         if (genreResult.length === 0) {
            throw new Error(`Genre '${genre}' not found`);
         }

         const genreID = genreResult[0].genreID;

         // Check if the relationship already exists
         const [existingResult] = await pool.query(
            "SELECT bookGenreID FROM BookGenres WHERE bookID = ? AND genreID = ?",
            [bookID, genreID]
         );

         if (existingResult.length > 0) {
            throw new Error(`Book genre relationship already exists`);
         }

         // Create the relationship
         const [result] = await pool.query(
            "INSERT INTO BookGenres (bookID, genreID) VALUES (?, ?)",
            [bookID, genreID]
         );

         // Return the created relationship with joined data
         const [newResult] = await pool.query(
            `SELECT bg.bookGenreID, b.title, g.genreName AS genre
             FROM BookGenres bg
             INNER JOIN Books b ON bg.bookID = b.bookID
             INNER JOIN Genres g ON bg.genreID = g.genreID
             WHERE bg.bookGenreID = ?`,
            [result.insertId]
         );

         return newResult[0];
      } catch (error) {
         console.error("Error creating book genre:", error);
         throw error;
      }
   }

   async update(id, data) {
      try {
         const { title, genre } = data;

         // Find the current relationship
         const [currentResult] = await pool.query(
            "SELECT bookID, genreID FROM BookGenres WHERE bookGenreID = ?",
            [id]
         );

         if (currentResult.length === 0) {
            return null;
         }

         let bookID = currentResult[0].bookID;
         let genreID = currentResult[0].genreID;

         // Update bookID if title is provided
         if (title) {
            const [bookResult] = await pool.query(
               "SELECT bookID FROM Books WHERE title = ?",
               [title]
            );

            if (bookResult.length === 0) {
               throw new Error(`Book with title '${title}' not found`);
            }

            bookID = bookResult[0].bookID;
         }

         // Update genreID if genre is provided
         if (genre) {
            const [genreResult] = await pool.query(
               "SELECT genreID FROM Genres WHERE genreName = ?",
               [genre]
            );

            if (genreResult.length === 0) {
               throw new Error(`Genre '${genre}' not found`);
            }

            genreID = genreResult[0].genreID;
         }

         // Check if the new relationship already exists (excluding current)
         const [existingResult] = await pool.query(
            "SELECT bookGenreID FROM BookGenres WHERE bookID = ? AND genreID = ? AND bookGenreID != ?",
            [bookID, genreID, id]
         );

         if (existingResult.length > 0) {
            throw new Error(`Book genre relationship already exists`);
         }

         // Update the relationship
         await pool.query(
            "UPDATE BookGenres SET bookID = ?, genreID = ? WHERE bookGenreID = ?",
            [bookID, genreID, id]
         );

         // Return the updated relationship with joined data
         const [updatedResult] = await pool.query(
            `SELECT bg.bookGenreID, b.title, g.genreName AS genre
             FROM BookGenres bg
             INNER JOIN Books b ON bg.bookID = b.bookID
             INNER JOIN Genres g ON bg.genreID = g.genreID
             WHERE bg.bookGenreID = ?`,
            [id]
         );

         return updatedResult[0];
      } catch (error) {
         console.error("Error updating book genre:", error);
         throw error;
      }
   }

   async deleteById(id) {
      try {
         const [result] = await pool.query(
            "DELETE FROM BookGenres WHERE bookGenreID = ?",
            [id]
         );

         return result.affectedRows > 0;
      } catch (error) {
         console.error("Error deleting book genre:", error);
         throw error;
      }
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
