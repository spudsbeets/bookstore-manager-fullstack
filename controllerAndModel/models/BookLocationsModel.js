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

class BookLocationsModel extends BaseModel {
   constructor() {
      super("BookLocations", "bookLocationID");
   }

   async create(data) {
      try {
         const { bookID, slocID, quantity } = data;

         // Check if the relationship already exists
         const [existingResult] = await pool.query(
            "SELECT bookLocationID FROM BookLocations WHERE bookID = ? AND slocID = ?",
            [bookID, slocID]
         );

         if (existingResult.length > 0) {
            throw new Error(
               `Book location relationship already exists for this book and location combination`
            );
         }

         // Call the specific stored procedure for BookLocations
         const [result] = await pool.query(
            "CALL sp_dynamic_create_book_locations(?)",
            [JSON.stringify({ bookID, slocID, quantity })]
         );

         // Extract the result from the stored procedure
         const jsonResult = result[0][0].result;
         const parsedResult = JSON.parse(jsonResult);

         // Return the created relationship with joined data
         const [newResult] = await pool.query(
            `SELECT bl.bookLocationID, s.slocName, b.title, bl.quantity
             FROM BookLocations bl
             INNER JOIN Books b ON bl.bookID = b.bookID
             INNER JOIN SLOCS s ON bl.slocID = s.slocID
             WHERE bl.bookLocationID = ?`,
            [parsedResult.id]
         );

         return newResult[0];
      } catch (error) {
         console.error("Error creating book location:", error);
         throw error;
      }
   }

   async update(id, data) {
      try {
         const { bookID, slocID, quantity } = data;

         // Check if the new relationship already exists (excluding current)
         const [existingResult] = await pool.query(
            "SELECT bookLocationID FROM BookLocations WHERE bookID = ? AND slocID = ? AND bookLocationID != ?",
            [bookID, slocID, id]
         );

         if (existingResult.length > 0) {
            throw new Error(
               `Book location relationship already exists for this book and location combination`
            );
         }

         // Call the specific stored procedure for BookLocations
         const [result] = await pool.query(
            "CALL sp_dynamic_update_book_locations(?, ?)",
            [id, JSON.stringify({ bookID, slocID, quantity })]
         );

         // Extract the result from the stored procedure
         const jsonResult = result[0][0].result;

         if (!jsonResult) {
            return null;
         }

         // Return the updated relationship with joined data
         const [updatedResult] = await pool.query(
            `SELECT bl.bookLocationID, s.slocName, b.title, bl.quantity
             FROM BookLocations bl
             INNER JOIN Books b ON bl.bookID = b.bookID
             INNER JOIN SLOCS s ON bl.slocID = s.slocID
             WHERE bl.bookLocationID = ?`,
            [id]
         );

         return updatedResult[0];
      } catch (error) {
         console.error("Error updating book location:", error);
         throw error;
      }
   }

   async deleteById(id) {
      try {
         await pool.query("CALL sp_deleteBookLocation(?)", [id]);
         return true;
      } catch (error) {
         console.error("Error deleting book location:", error);
         throw error;
      }
   }

   async findByBookId(bookId) {
      try {
         const query = `
        SELECT bl.bookLocationID, s.slocName, b.title, bl.quantity
        FROM BookLocations bl
        INNER JOIN Books b ON bl.bookID = b.bookID
        INNER JOIN SLOCS s ON bl.slocID = s.slocID
        WHERE bl.bookID = ?
        ORDER BY s.slocName
      `;
         const [results] = await pool.query(query, [bookId]);
         return results;
      } catch (error) {
         console.error("Error finding book locations by book ID:", error);
         throw error;
      }
   }

   async findByLocationId(locationId) {
      try {
         const query = `
        SELECT bl.bookLocationID, s.slocName, b.title, bl.quantity
        FROM BookLocations bl
        INNER JOIN Books b ON bl.bookID = b.bookID
        INNER JOIN SLOCS s ON bl.slocID = s.slocID
        WHERE bl.slocID = ?
        ORDER BY b.title
      `;
         const [results] = await pool.query(query, [locationId]);
         return results;
      } catch (error) {
         console.error("Error finding book locations by location ID:", error);
         throw error;
      }
   }

   async findAll() {
      try {
         const query = `
        SELECT bl.bookLocationID, s.slocName, b.title, bl.quantity
        FROM BookLocations bl
        INNER JOIN Books b ON bl.bookID = b.bookID
        INNER JOIN SLOCS s ON bl.slocID = s.slocID
        ORDER BY b.title
      `;
         const [results] = await pool.query(query);
         return results;
      } catch (error) {
         console.error("Error finding all book locations:", error);
         throw error;
      }
   }
}

export default new BookLocationsModel();
