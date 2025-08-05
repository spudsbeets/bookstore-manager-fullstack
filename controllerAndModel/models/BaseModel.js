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
import pool from "../database/db-connector.js";

class BaseModel {
   constructor(tableName, idColumn = "id") {
      this.tableName = tableName;
      this.idColumn = idColumn;
   }

   async findAll(whereClause = "") {
      try {
         const [rows] = await pool.query(
            `SELECT * FROM ${this.tableName} ${whereClause}`
         );
         return rows;
      } catch (error) {
         console.error(`Error finding all ${this.tableName}:`, error);
         throw error;
      }
   }

   async findById(id) {
      try {
         const [rows] = await pool.query(
            `SELECT * FROM ${this.tableName} WHERE ${this.idColumn} = ?`,
            [id]
         );
         return rows.length > 0 ? rows[0] : null;
      } catch (error) {
         console.error(`Error finding ${this.tableName} by ID:`, error);
         throw error;
      }
   }

   async create(data) {
      try {
         // Use dynamic stored procedure
         const [result] = await pool.query("CALL sp_dynamic_create(?, ?)", [
            this.tableName,
            JSON.stringify(data),
         ]);

         // Extract the result from the stored procedure
         const [rows] = await pool.query(
            `SELECT * FROM ${this.tableName} WHERE ${this.idColumn} = LAST_INSERT_ID()`
         );

         if (rows.length > 0) {
            return { id: rows[0][this.idColumn], ...data };
         }
         return null;
      } catch (error) {
         console.error(`Error creating ${this.tableName}:`, error);
         throw error;
      }
   }

   async update(id, data) {
      try {
         // Use dynamic stored procedure
         const [result] = await pool.query("CALL sp_dynamic_update(?, ?, ?)", [
            this.tableName,
            id,
            JSON.stringify(data),
         ]);

         // Check if update was successful
         const [rows] = await pool.query(
            `SELECT * FROM ${this.tableName} WHERE ${this.idColumn} = ?`,
            [id]
         );

         if (rows.length > 0) {
            return { id, ...data };
         }
         return null;
      } catch (error) {
         console.error(`Error updating ${this.tableName}:`, error);
         throw error;
      }
   }

   async deleteById(id) {
      try {
         const [result] = await pool.query("CALL sp_dynamic_delete(?, ?, ?)", [
            this.tableName,
            this.idColumn,
            id,
         ]);

         return result[0][0].success;
      } catch (error) {
         console.error(`Error deleting ${this.tableName}:`, error);
         throw error;
      }
   }
}

export default BaseModel;
