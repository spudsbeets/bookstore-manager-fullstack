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
         const columns = Object.keys(data).join(", ");
         const placeholders = Object.keys(data)
            .map(() => "?")
            .join(", ");
         const values = Object.values(data);

         const [result] = await pool.query(
            `INSERT INTO ${this.tableName} (${columns}) VALUES (${placeholders})`,
            values
         );

         return { id: result.insertId, ...data };
      } catch (error) {
         console.error(`Error creating ${this.tableName}:`, error);
         throw error;
      }
   }

   async update(id, data) {
      try {
         const setClause = Object.keys(data)
            .map((key) => `${key} = ?`)
            .join(", ");
         const values = [...Object.values(data), id];

         const [result] = await pool.query(
            `UPDATE ${this.tableName} SET ${setClause} WHERE ${this.idColumn} = ?`,
            values
         );

         if (result.affectedRows === 0) {
            return null;
         }

         return { id, ...data };
      } catch (error) {
         console.error(`Error updating ${this.tableName}:`, error);
         throw error;
      }
   }

   async deleteById(id) {
      try {
         const [result] = await pool.query(
            `DELETE FROM ${this.tableName} WHERE ${this.idColumn} = ?`,
            [id]
         );

         return result.affectedRows > 0;
      } catch (error) {
         console.error(`Error deleting ${this.tableName}:`, error);
         throw error;
      }
   }
}

export default BaseModel;
