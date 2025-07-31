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
