import BaseModel from "./BaseModel.js";
import pool from "../database/db-connector.js";

class BookGenresModel extends BaseModel {
   constructor() {
      super("BookGenres", "bookGenreID");
   }

   async create(data) {
      try {
         const { genreID, bookID } = data;

         const query = `
            INSERT INTO BookGenres (genreID, bookID) VALUES (?, ?);
         `;

         const [result] = await pool.query(query, [genreID, bookID]);

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
         const { genreID, bookID } = data;

         const query = `
            UPDATE BookGenres SET genreID = ?, bookID = ? WHERE bookGenreID = ?;
         `;

         await pool.query(query, [genreID, bookID, id]);

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
         const query = `
            DELETE FROM BookGenres WHERE bookGenreID = ?;
         `;

         const [result] = await pool.query(query, [id]);

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

   async updateForBook(bookId, genreIds) {
      try {
         // First, delete all existing relationships for this book
         const deleteQuery = `DELETE FROM BookGenres WHERE bookID = ?`;
         await pool.query(deleteQuery, [bookId]);

         // Then, insert the new relationships
         if (genreIds && genreIds.length > 0) {
            const insertQuery = `INSERT INTO BookGenres (bookID, genreID) VALUES ?`;
            const values = genreIds.map((genreId) => [bookId, genreId]);
            await pool.query(insertQuery, [values]);
         }

         return { message: "Book genres updated successfully" };
      } catch (error) {
         console.error("Error updating book genres:", error);
         throw error;
      }
   }
}

export default new BookGenresModel();
