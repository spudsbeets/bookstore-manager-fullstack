import BaseModel from "./BaseModel.js";
import pool from "../database/db-connector.js";

class BookAuthorsModel extends BaseModel {
   constructor() {
      super("BookAuthors", "bookAuthorID");
   }

   async findByBookId(bookId) {
      try {
         const query = `
        SELECT ba.bookAuthorID, b.title, a.fullName AS author
        FROM BookAuthors ba
        INNER JOIN Books b ON ba.bookID = b.bookID
        INNER JOIN Authors a ON ba.authorID = a.authorID
        WHERE ba.bookID = ?
        ORDER BY a.fullName
      `;
         const [results] = await pool.query(query, [bookId]);
         return results;
      } catch (error) {
         console.error("Error finding book authors by book ID:", error);
         throw error;
      }
   }

   async findByAuthorId(authorId) {
      try {
         const query = `
        SELECT ba.bookAuthorID, b.title, a.fullName AS author
        FROM BookAuthors ba
        INNER JOIN Books b ON ba.bookID = b.bookID
        INNER JOIN Authors a ON ba.authorID = a.authorID
        WHERE ba.authorID = ?
        ORDER BY b.title
      `;
         const [results] = await pool.query(query, [authorId]);
         return results;
      } catch (error) {
         console.error("Error finding book authors by author ID:", error);
         throw error;
      }
   }

   async findAll() {
      try {
         const query = `
        SELECT ba.bookAuthorID, b.title, a.fullName AS author
        FROM BookAuthors ba
        INNER JOIN Books b ON ba.bookID = b.bookID
        INNER JOIN Authors a ON ba.authorID = a.authorID
        ORDER BY b.title, a.fullName
      `;
         const [results] = await pool.query(query);
         return results;
      } catch (error) {
         console.error("Error finding all book authors:", error);
         throw error;
      }
   }
}

export default new BookAuthorsModel();
