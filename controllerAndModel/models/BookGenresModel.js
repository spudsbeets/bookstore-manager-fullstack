/**
 * @date August 4, 2025
 * @based_on The Model class structure from the CS 290 course materials, particularly the concept of a base model for shared functionality.
 *
 * @degree_of_originality This model inherits from a generic BaseModel. The custom methods within this class, such as `findAllWithFullName()` and `findByFullName()`, were written specifically for this project to handle author-related database queries.
 *
 * @source_url The CS 290 Canvas modules discussing MVC architecture and database models.
 *
 * @ai_tool_usage This model was generated using Cursor, an AI code editor, based on the database schema and a template. The generated code was then refined to add custom logic.
 */
import BaseModel from "./BaseModel.js";
import pool from "../database/db-connector.js";

class BookGenresModel extends BaseModel {
   constructor() {
      super("BookGenres", "bookGenreID");
   }

   async create(data) {
      try {
         const { genreID, bookID } = data;

         // Check if this book-genre relationship already exists
         const existingQuery = `
            SELECT COUNT(*) as count FROM BookGenres 
            WHERE bookID = ? AND genreID = ?
         `;
         const [existingResult] = await pool.query(existingQuery, [
            bookID,
            genreID,
         ]);

         if (existingResult[0].count > 0) {
            throw new Error(
               `Book genre relationship already exists for this book and genre combination`
            );
         }

         // Call the specific stored procedure for BookGenres
         const [result] = await pool.query(
            "CALL sp_dynamic_create_book_genres(?)",
            [JSON.stringify({ genreID, bookID })]
         );

         // Extract the result from the stored procedure
         const jsonResult = result[0][0].result;
         const parsedResult = JSON.parse(jsonResult);

         // Return the created relationship with joined data
         const [newResult] = await pool.query(
            `SELECT bg.bookGenreID, b.title, g.genreName AS genre
             FROM BookGenres bg
             INNER JOIN Books b ON bg.bookID = b.bookID
             INNER JOIN Genres g ON bg.genreID = g.genreID
             WHERE bg.bookGenreID = ?`,
            [parsedResult.id]
         );

         return newResult[0];
      } catch (error) {
         console.error("Error creating book genre:", error);
         throw error;
      }
   }

   async update(id, data) {
      try {
         const { genreID, bookID } = data;

         // Call the specific stored procedure for BookGenres
         const [result] = await pool.query(
            "CALL sp_dynamic_update_book_genres(?, ?)",
            [id, JSON.stringify({ genreID, bookID })]
         );

         // Extract the result from the stored procedure
         const jsonResult = result[0][0].result;

         if (!jsonResult) {
            return null;
         }

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

   async updateForBook(bookId, genreIds) {
      try {
         // Get current genre relationships for this book
         const [currentGenres] = await pool.query(
            "SELECT genreID FROM BookGenres WHERE bookID = ?",
            [bookId]
         );
         const currentGenreIds = currentGenres.map((g) => g.genreID);

         // Find genres to add (in new list but not in current)
         const genresToAdd = genreIds.filter(
            (id) => !currentGenreIds.includes(id)
         );

         // Find genres to remove (in current but not in new list)
         const genresToRemove = currentGenreIds.filter(
            (id) => !genreIds.includes(id)
         );

         // Remove genres that are no longer associated
         if (genresToRemove.length > 0) {
            await pool.query(
               "DELETE FROM BookGenres WHERE bookID = ? AND genreID IN (?)",
               [bookId, genresToRemove]
            );
         }

         // Add new genre relationships
         if (genresToAdd.length > 0) {
            const values = genresToAdd.map((genreId) => [bookId, genreId]);
            await pool.query(
               "INSERT INTO BookGenres (bookID, genreID) VALUES ?",
               [values]
            );
         }

         return { message: "Book genres updated successfully" };
      } catch (error) {
         console.error("Error updating book genres:", error);
         throw error;
      }
   }

   async deleteById(id) {
      try {
         await pool.query("CALL sp_deleteBookGenre(?)", [id]);
         return true;
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
        SELECT
            bg.bookGenreID,
            b.title,
            g.genreName AS genre
        FROM
            Books AS b
        JOIN
            BookGenres AS bg ON b.bookID = bg.bookID
        JOIN
            Genres AS g ON bg.genreID = g.genreID
        ORDER BY
            b.title
      `;
         const [results] = await pool.query(query);
         return results;
      } catch (error) {
         console.error("Error finding all book genres:", error);
         throw error;
      }
   }

   async getBooksForDropdown() {
      try {
         const query = `
        SELECT b.title, b.bookID FROM Books b;
      `;
         const [results] = await pool.query(query);
         return results;
      } catch (error) {
         console.error("Error fetching books for dropdown:", error);
         throw error;
      }
   }

   async getGenresForDropdown() {
      try {
         const query = `
        SELECT g.genreName, g.genreID FROM Genres g;
      `;
         const [results] = await pool.query(query);
         return results;
      } catch (error) {
         console.error("Error fetching genres for dropdown:", error);
         throw error;
      }
   }
}

export default new BookGenresModel();
