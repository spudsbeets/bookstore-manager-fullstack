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
}

export default new AuthorsModel();
