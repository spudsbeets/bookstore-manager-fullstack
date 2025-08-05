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

class AuthorsModel extends BaseModel {
   constructor() {
      super("Authors", "authorID");
   }

   // Custom methods specific to Authors
   async findAllWithFullName() {
      try {
         const [rows] = await pool.query(`
                SELECT authorID, firstName, middleName, lastName,
                       CONCAT(firstName, ' ', COALESCE(middleName, ''), ' ', lastName) as fullName
                FROM Authors
            `);
         return rows;
      } catch (error) {
         console.error("Error fetching authors with full name:", error);
         throw error;
      }
   }

   async findByFullName(fullName) {
      try {
         const [rows] = await pool.query(
            `
                SELECT * FROM Authors 
                WHERE CONCAT(firstName, ' ', COALESCE(middleName, ''), ' ', lastName) LIKE ?
            `,
            [`%${fullName}%`]
         );
         return rows;
      } catch (error) {
         console.error("Error finding author by full name:", error);
         throw error;
      }
   }

   // Override create method to use stored procedure
   async create(data) {
      try {
         // Call the specific stored procedure for Authors
         const [result] = await pool.query(
            "CALL sp_dynamic_create_authors(?)",
            [JSON.stringify(data)]
         );

         // Extract the result from the stored procedure
         const jsonResult = result[0][0].result;
         const parsedResult = JSON.parse(jsonResult);

         return { id: parsedResult.id, ...data };
      } catch (error) {
         console.error(`Error creating ${this.tableName}:`, error);
         throw error;
      }
   }

   // Override update method to use stored procedure
   async update(id, data) {
      try {
         // Call the specific stored procedure for Authors
         const [result] = await pool.query(
            "CALL sp_dynamic_update_authors(?, ?)",
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

   // Override deleteById method to use stored procedure
   async deleteById(id) {
      try {
         // Call the stored procedure
         await pool.query("CALL sp_deleteAuthor(?)", [id]);
         return true; // If no error, deletion was successful
      } catch (error) {
         console.error("Error deleting author:", error);
         throw error;
      }
   }
}

export default new AuthorsModel();
