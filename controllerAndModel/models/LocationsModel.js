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

class LocationsModel extends BaseModel {
   constructor() {
      super("SLOCS", "slocID");
   }

   // Custom methods specific to Locations
   async findAllOrdered() {
      try {
         const rows = await this.findAll("ORDER BY slocName");
         return rows;
      } catch (error) {
         console.error("Error fetching locations ordered:", error);
         throw error;
      }
   }

   async findByName(name) {
      try {
         const rows = await this.findAll(`WHERE slocName LIKE '%${name}%'`);
         return rows;
      } catch (error) {
         console.error("Error finding location by name:", error);
         throw error;
      }
   }
}

export default new LocationsModel();
