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

class BooksModel extends BaseModel {
   constructor() {
      super("Books", "bookID");
   }

   // Override findAll to use the view
   async findAll() {
      try {
         const [rows] = await pool.query(`SELECT * FROM v_books`);
         return rows;
      } catch (error) {
         console.error("Error fetching books:", error);
         throw error;
      }
   }

   // Override findById to include publisher
   async findById(id) {
      try {
         const [rows] = await pool.query(
            "SELECT * FROM v_book_with_publisher WHERE bookID = ?",
            [id]
         );
         return rows.length > 0 ? rows[0] : null;
      } catch (error) {
         console.error("Error fetching book by ID:", error);
         throw error;
      }
   }

   // Custom methods for Books
   async findByTitle(title) {
      try {
         const [rows] = await pool.query(
            "SELECT * FROM v_books_with_publisher WHERE title LIKE ?",
            [`%${title}%`]
         );
         return rows;
      } catch (error) {
         console.error("Error finding books by title:", error);
         throw error;
      }
   }

   async findByPublisher(publisherId) {
      try {
         const [rows] = await pool.query(
            "SELECT * FROM v_books_with_publisher WHERE publisherID = ?",
            [publisherId]
         );
         return rows;
      } catch (error) {
         console.error("Error finding books by publisher:", error);
         throw error;
      }
   }

   async findInStock() {
      try {
         const [rows] = await pool.query("SELECT * FROM v_books_in_stock");
         return rows;
      } catch (error) {
         console.error("Error finding books in stock:", error);
         throw error;
      }
   }

   // Override create method to use stored procedure
   async create(data) {
      try {
         // Call the specific stored procedure for Books
         const [result] = await pool.query("CALL sp_dynamic_create_books(?)", [
            JSON.stringify(data),
         ]);

         // Extract the result from the stored procedure
         const jsonResult = result[0][0].result;
         const parsedResult = JSON.parse(jsonResult);

         // Return the complete data from the stored procedure
         return parsedResult;
      } catch (error) {
         console.error(`Error creating ${this.tableName}:`, error);
         throw error;
      }
   }

   // Override update method to use stored procedure
   async update(id, data) {
      try {
         // Call the specific stored procedure for Books
         const [result] = await pool.query(
            "CALL sp_dynamic_update_books(?, ?)",
            [id, JSON.stringify(data)]
         );

         // Extract the result from the stored procedure
         const jsonResult = result[0][0].result;

         if (jsonResult) {
            const parsedResult = JSON.parse(jsonResult);
            return { id, ...data };
         }
         return null;
      } catch (error) {
         console.error(`Error updating ${this.tableName}:`, error);
         throw error;
      }
   }
}

export default new BooksModel();
