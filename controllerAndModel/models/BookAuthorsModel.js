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

class BookAuthorsModel extends BaseModel {
   constructor() {
      super("BookAuthors", "bookAuthorID");
   }

   async findByBookId(bookId) {
      try {
         const [results] = await pool.query(
            "SELECT * FROM v_book_authors WHERE bookID = ? ORDER BY author",
            [bookId]
         );
         return results;
      } catch (error) {
         console.error("Error finding book authors by book ID:", error);
         throw error;
      }
   }

   async findByAuthorId(authorId) {
      try {
         const [results] = await pool.query(
            "SELECT * FROM v_book_authors WHERE authorID = ? ORDER BY title",
            [authorId]
         );
         return results;
      } catch (error) {
         console.error("Error finding book authors by author ID:", error);
         throw error;
      }
   }

   async findAll() {
      try {
         const [results] = await pool.query(
            "SELECT * FROM v_book_authors ORDER BY title"
         );
         return results;
      } catch (error) {
         console.error("Error finding all book authors:", error);
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

   async getAuthorsForDropdown() {
      try {
         const query = `
        SELECT a.fullName, a.authorID FROM Authors a;
      `;
         const [results] = await pool.query(query);
         return results;
      } catch (error) {
         console.error("Error fetching authors for dropdown:", error);
         throw error;
      }
   }

   async create(data) {
      try {
         const { authorID, bookID } = data;

         // Check if this book-author relationship already exists
         const existingQuery = `
            SELECT COUNT(*) as count FROM BookAuthors 
            WHERE bookID = ? AND authorID = ?
         `;
         const [existingResult] = await pool.query(existingQuery, [
            bookID,
            authorID,
         ]);

         if (existingResult[0].count > 0) {
            throw new Error(
               `Book author relationship already exists for this book and author combination`
            );
         }

         // Call the specific stored procedure for BookAuthors
         const [result] = await pool.query(
            "CALL sp_dynamic_create_book_authors(?)",
            [JSON.stringify({ authorID, bookID })]
         );

         // Extract the result from the stored procedure
         const jsonResult = result[0][0].result;
         const parsedResult = JSON.parse(jsonResult);

         // Return the created relationship with joined data
         const [newResult] = await pool.query(
            `SELECT ba.bookAuthorID, b.title, a.fullName AS author
             FROM BookAuthors ba
             INNER JOIN Books b ON ba.bookID = b.bookID
             INNER JOIN Authors a ON ba.authorID = a.authorID
             WHERE ba.bookAuthorID = ?`,
            [parsedResult.id]
         );

         return newResult[0];
      } catch (error) {
         console.error("Error creating book author:", error);
         throw error;
      }
   }

   async update(id, data) {
      try {
         const { authorID, bookID } = data;

         // Call the specific stored procedure for BookAuthors
         const [result] = await pool.query(
            "CALL sp_dynamic_update_book_authors(?, ?)",
            [id, JSON.stringify({ authorID, bookID })]
         );

         // Extract the result from the stored procedure
         const jsonResult = result[0][0].result;

         if (!jsonResult) {
            return null;
         }

         // Return the updated relationship with joined data
         const [updatedResult] = await pool.query(
            `SELECT ba.bookAuthorID, b.title, a.fullName AS author
             FROM BookAuthors ba
             INNER JOIN Books b ON ba.bookID = b.bookID
             INNER JOIN Authors a ON ba.authorID = a.authorID
             WHERE ba.bookAuthorID = ?`,
            [id]
         );

         return updatedResult[0];
      } catch (error) {
         console.error("Error updating book author:", error);
         throw error;
      }
   }

   async updateForBook(bookId, authorIds) {
      try {
         // Get current author relationships for this book
         const [currentAuthors] = await pool.query(
            "SELECT authorID FROM BookAuthors WHERE bookID = ?",
            [bookId]
         );
         const currentAuthorIds = currentAuthors.map((a) => a.authorID);

         // Find authors to add (in new list but not in current)
         const authorsToAdd = authorIds.filter(
            (id) => !currentAuthorIds.includes(id)
         );

         // Find authors to remove (in current but not in new list)
         const authorsToRemove = currentAuthorIds.filter(
            (id) => !authorIds.includes(id)
         );

         // Remove authors that are no longer associated
         if (authorsToRemove.length > 0) {
            await pool.query(
               "DELETE FROM BookAuthors WHERE bookID = ? AND authorID IN (?)",
               [bookId, authorsToRemove]
            );
         }

         // Add new author relationships
         if (authorsToAdd.length > 0) {
            const values = authorsToAdd.map((authorId) => [bookId, authorId]);
            await pool.query(
               "INSERT INTO BookAuthors (bookID, authorID) VALUES ?",
               [values]
            );
         }

         return { message: "Book authors updated successfully" };
      } catch (error) {
         console.error("Error updating book authors:", error);
         throw error;
      }
   }

   async deleteById(id) {
      try {
         await pool.query("CALL sp_deleteBookAuthor(?)", [id]);
         return true;
      } catch (error) {
         console.error("Error deleting book author:", error);
         throw error;
      }
   }
}

export default new BookAuthorsModel();
