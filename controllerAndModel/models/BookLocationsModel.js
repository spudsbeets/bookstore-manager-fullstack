import BaseModel from "./BaseModel.js";
import pool from "../database/db-connector.js";

class BookLocationsModel extends BaseModel {
   constructor() {
      super("BookLocations", "bookLocationID");
   }

   async create(data) {
      try {
         // For BookLocations, we need to find the bookID and slocID from the title and location names
         const { title, location, quantity } = data;

         // Find the bookID by title
         const [bookResult] = await pool.query(
            "SELECT bookID FROM Books WHERE title = ?",
            [title]
         );

         if (bookResult.length === 0) {
            throw new Error(`Book with title '${title}' not found`);
         }

         const bookID = bookResult[0].bookID;

         // Find the slocID by location name
         const [locationResult] = await pool.query(
            "SELECT slocID FROM SLOCS WHERE slocName = ?",
            [location]
         );

         if (locationResult.length === 0) {
            throw new Error(`Location '${location}' not found`);
         }

         const slocID = locationResult[0].slocID;

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
            `SELECT bl.bookLocationID, b.title, s.slocName AS location, bl.quantity
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
         const { title, location, quantity } = data;

         // Find the current relationship
         const [currentResult] = await pool.query(
            "SELECT bookID, slocID, quantity FROM BookLocations WHERE bookLocationID = ?",
            [id]
         );

         if (currentResult.length === 0) {
            return null;
         }

         let bookID = currentResult[0].bookID;
         let slocID = currentResult[0].slocID;
         let newQuantity = currentResult[0].quantity;

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

         // Update slocID if location is provided
         if (location) {
            const [locationResult] = await pool.query(
               "SELECT slocID FROM SLOCS WHERE slocName = ?",
               [location]
            );

            if (locationResult.length === 0) {
               throw new Error(`Location '${location}' not found`);
            }

            slocID = locationResult[0].slocID;
         }

         // Update quantity if provided
         if (quantity !== undefined) {
            newQuantity = quantity;
         }

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
            [bookID, slocID, newQuantity, id]
         );

         // Return the updated relationship with joined data
         const [updatedResult] = await pool.query(
            `SELECT bl.bookLocationID, b.title, s.slocName AS location, bl.quantity
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
        SELECT bl.bookLocationID, b.title, s.slocName AS location, bl.quantity
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
        SELECT bl.bookLocationID, b.title, s.slocName AS location, bl.quantity
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
        SELECT bl.bookLocationID, b.title, s.slocName AS location, bl.quantity
        FROM BookLocations bl
        INNER JOIN Books b ON bl.bookID = b.bookID
        INNER JOIN SLOCS s ON bl.slocID = s.slocID
        ORDER BY b.title, s.slocName
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
