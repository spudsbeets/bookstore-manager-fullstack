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
            throw new Error(`Book location relationship already exists`);
         }

         // Create the relationship
         const [result] = await pool.query(
            "INSERT INTO BookLocations (bookID, slocID, quantity) VALUES (?, ?, ?)",
            [bookID, slocID, quantity]
         );

         // Return the created relationship with joined data
         const [newResult] = await pool.query(
            `SELECT bl.bookLocationID, s.slocName, b.title, bl.quantity
             FROM BookLocations bl
             INNER JOIN Books b ON bl.bookID = b.bookID
             INNER JOIN SLOCS s ON bl.slocID = s.slocID
             WHERE bl.bookLocationID = ?`,
            [result.insertId]
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
            throw new Error(`Book location relationship already exists`);
         }

         // Update the relationship
         await pool.query(
            "UPDATE BookLocations SET bookID = ?, slocID = ?, quantity = ? WHERE bookLocationID = ?",
            [bookID, slocID, quantity, id]
         );

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
         const [result] = await pool.query(
            "DELETE FROM BookLocations WHERE bookLocationID = ?",
            [id]
         );

         return result.affectedRows > 0;
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
