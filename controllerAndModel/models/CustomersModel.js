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

class CustomersModel extends BaseModel {
   constructor() {
      super("Customers", "customerID");
   }

   // Custom methods specific to Customers
   async findByEmail(email) {
      try {
         const [rows] = await pool.query(
            `
                SELECT * FROM Customers WHERE email = ?
            `,
            [email]
         );
         return rows.length > 0 ? rows[0] : null;
      } catch (error) {
         console.error("Error finding customer by email:", error);
         throw error;
      }
   }

   async findByFullName(firstName, lastName) {
      try {
         const [rows] = await pool.query(
            `
                SELECT * FROM Customers 
                WHERE firstName LIKE ? AND lastName LIKE ?
            `,
            [`%${firstName}%`, `%${lastName}%`]
         );
         return rows;
      } catch (error) {
         console.error("Error finding customer by full name:", error);
         throw error;
      }
   }

   async findAllWithFullName() {
      try {
         const [rows] = await pool.query(`
                SELECT customerID, firstName, lastName, email, phoneNumber,
                       CONCAT(firstName, ' ', lastName) as fullName
                FROM Customers
                ORDER BY lastName, firstName
            `);
         return rows;
      } catch (error) {
         console.error("Error fetching customers with full name:", error);
         throw error;
      }
   }
}

export default new CustomersModel();
