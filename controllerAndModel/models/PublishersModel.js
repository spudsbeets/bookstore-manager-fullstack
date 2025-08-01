import BaseModel from "./BaseModel.js";

class PublishersModel extends BaseModel {
   constructor() {
      super("Publishers", "publisherID");
   }

   // Custom methods specific to Publishers
   async findByName(name) {
      try {
         const rows = await this.findAll(
            `WHERE publisherName LIKE '%${name}%'`
         );
         return rows;
      } catch (error) {
         console.error("Error finding publisher by name:", error);
         throw error;
      }
   }

   async findAllOrdered() {
      try {
         const rows = await this.findAll("ORDER BY publisherName");
         return rows;
      } catch (error) {
         console.error("Error fetching publishers ordered:", error);
         throw error;
      }
   }
}

export default new PublishersModel();
