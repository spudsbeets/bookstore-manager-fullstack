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

class SalesRateLocationsModel extends BaseModel {
   constructor() {
      super("SalesRateLocations", "salesRateID");
   }

   // Custom methods specific to SalesRateLocations
   async findAllWithLocation() {
      try {
         const [rows] = await pool.query(`
                SELECT salesRateID, CONCAT(county, ", ", state) as location, taxRate 
                FROM SalesRateLocations 
                ORDER BY state, county
            `);
         return rows;
      } catch (error) {
         console.error("Error fetching sales rate locations:", error);
         throw error;
      }
   }

   async findByState(state) {
      try {
         const [rows] = await pool.query(
            `
                SELECT * FROM SalesRateLocations WHERE state = ?
            `,
            [state]
         );
         return rows;
      } catch (error) {
         console.error("Error finding sales rate locations by state:", error);
         throw error;
      }
   }

   // Custom create method to handle location field
   async create(data) {
      try {
         let { location, taxRate, ...otherData } = data;

         // Parse location into county and state
         let county, state;
         if (!location) {
            throw new Error("Location is required");
         }
         if (location.includes(", ")) {
            [county, state] = location.split(", ");
            if (!county.trim() || !state.trim()) {
               throw new Error(
                  "Location must be in format 'County, State' (e.g., 'Multnomah, Oregon')"
               );
            }
         } else {
            throw new Error(
               "Location must be in format 'County, State' (e.g., 'Multnomah, Oregon')"
            );
         }

         const insertData = {
            county: county.trim(),
            state: state.trim(),
            taxRate: taxRate,
            ...otherData,
         };

         const columns = Object.keys(insertData).join(", ");
         const placeholders = Object.keys(insertData)
            .map(() => "?")
            .join(", ");
         const values = Object.values(insertData);

         const [result] = await pool.query(
            `INSERT INTO ${this.tableName} (${columns}) VALUES (${placeholders})`,
            values
         );

         return { salesRateID: result.insertId, ...insertData };
      } catch (error) {
         console.error(`Error creating ${this.tableName}:`, error);
         throw error;
      }
   }

   // Custom update method to handle location field
   async update(id, data) {
      try {
         let { location, taxRate, ...otherData } = data;

         // Parse location into county and state if provided
         let updateData = { ...otherData };
         if (location && location.includes(", ")) {
            const [county, state] = location.split(", ");
            updateData.county = county.trim();
            updateData.state = state.trim();
         }
         if (taxRate !== undefined) {
            updateData.taxRate = taxRate;
         }

         const setClause = Object.keys(updateData)
            .map((key) => `${key} = ?`)
            .join(", ");
         const values = [...Object.values(updateData), id];

         const [result] = await pool.query(
            `UPDATE ${this.tableName} SET ${setClause} WHERE ${this.idColumn} = ?`,
            values
         );

         if (result.affectedRows === 0) {
            return null;
         }

         return { salesRateID: id, ...updateData };
      } catch (error) {
         console.error(`Error updating ${this.tableName}:`, error);
         throw error;
      }
   }
}

export default new SalesRateLocationsModel();
