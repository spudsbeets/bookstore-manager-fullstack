import http from "./http-common";

export interface ResetResponse {
   status: string;
   message: string;
   tablesCreated: string;
   sampleDataInserted: string;
}

class ResetService {
   async resetDatabase(): Promise<ResetResponse> {
      try {
         const response = await http.post("/reset");
         return response.data;
      } catch (error) {
         console.error("Error resetting database:", error);
         throw error;
      }
   }
}

export default new ResetService();
