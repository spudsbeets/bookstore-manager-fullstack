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
}

export default new SalesRateLocationsModel();
