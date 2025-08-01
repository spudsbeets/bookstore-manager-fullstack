import BaseModel from "./BaseModel.js";

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
}

export default new GenresModel();
