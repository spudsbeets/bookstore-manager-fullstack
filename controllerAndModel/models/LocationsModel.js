import BaseModel from "./BaseModel.js";

class LocationsModel extends BaseModel {
   constructor() {
      super("SLOCS", "slocID");
   }

   // Custom methods specific to Locations
   async findAllOrdered() {
      try {
         const [rows] = await this.findAll("ORDER BY slocName");
         return rows;
      } catch (error) {
         console.error("Error fetching locations ordered:", error);
         throw error;
      }
   }

   async findByName(name) {
      try {
         const [rows] = await this.findAll(`WHERE slocName LIKE '%${name}%'`);
         return rows;
      } catch (error) {
         console.error("Error finding location by name:", error);
         throw error;
      }
   }
}

export default new LocationsModel();
