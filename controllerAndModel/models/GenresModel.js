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

class GenresModel extends BaseModel {
   constructor() {
      super("Genres", "genreID");
   }

   // Custom methods specific to Genres
   async findByName(name) {
      try {
         const rows = await this.findAll(`WHERE genreName LIKE '%${name}%'`);
         return rows;
      } catch (error) {
         console.error("Error finding genre by name:", error);
         throw error;
      }
   }

   async findAllOrdered() {
      try {
         const rows = await this.findAll("ORDER BY genreName");
         return rows;
      } catch (error) {
         console.error("Error fetching genres ordered:", error);
         throw error;
      }
   }

   // Custom create method with duplicate checking
   async create(data) {
      try {
         // Check if genre with same name already exists
         const existingGenres = await this.findAll(
            `WHERE genreName = '${data.genreName}'`
         );
         if (existingGenres.length > 0) {
            throw new Error(
               `Genre with name '${data.genreName}' already exists`
            );
         }

         // Call the specific stored procedure for Genres
         const [result] = await pool.query("CALL sp_dynamic_create_genres(?)", [
            JSON.stringify(data),
         ]);

         // Extract the result from the stored procedure
         const jsonResult = result[0][0].result;
         const parsedResult = JSON.parse(jsonResult);

         return { id: parsedResult.id, ...data };
      } catch (error) {
         console.error("Error creating genre:", error);
         throw error;
      }
   }

   // Custom update method with duplicate checking
   async update(id, data) {
      try {
         // Check if genre with same name already exists (excluding current genre)
         const existingGenres = await this.findAll(
            `WHERE genreName = '${data.genreName}' AND genreID != ${id}`
         );
         if (existingGenres.length > 0) {
            throw new Error(
               `Genre with name '${data.genreName}' already exists`
            );
         }

         // Call the specific stored procedure for Genres
         const [result] = await pool.query(
            "CALL sp_dynamic_update_genres(?, ?)",
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
         console.error("Error updating genre:", error);
         throw error;
      }
   }

   async deleteById(id) {
      try {
         await pool.query("CALL sp_deleteGenre(?)", [id]);
         return true;
      } catch (error) {
         console.error("Error deleting genre:", error);
         throw error;
      }
   }
}

export default new GenresModel();
