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
        SELECT
            ba.bookAuthorID,
            b.title,
            a.fullName AS author
        FROM
            Books AS b
        JOIN
            BookAuthors AS ba ON b.bookID = ba.bookID
        JOIN
            Authors AS a ON ba.authorID = a.authorID
        ORDER BY
            b.title
      `;
         const [results] = await pool.query(query);
         return results;
      } catch (error) {
         console.error("Error finding all book authors:", error);
         throw error;
      }
   }

   async getBooksForDropdown() {
      try {
         const query = `
        SELECT b.title, b.bookID FROM Books b;
      `;
         const [results] = await pool.query(query);
         return results;
      } catch (error) {
         console.error("Error fetching books for dropdown:", error);
         throw error;
      }
   }

   async getAuthorsForDropdown() {
      try {
         const query = `
        SELECT a.fullName, a.authorID FROM Authors a;
      `;
         const [results] = await pool.query(query);
         return results;
      } catch (error) {
         console.error("Error fetching authors for dropdown:", error);
         throw error;
      }
   }

   async create(data) {
      try {
         const { authorID, bookID } = data;

         const query = `
            INSERT INTO BookAuthors (authorID, bookID) VALUES (?, ?);
         `;

         const [result] = await pool.query(query, [authorID, bookID]);

         // Return the created relationship with joined data
         const [newResult] = await pool.query(
            `SELECT ba.bookAuthorID, b.title, a.fullName AS author
             FROM BookAuthors ba
             INNER JOIN Books b ON ba.bookID = b.bookID
             INNER JOIN Authors a ON ba.authorID = a.authorID
             WHERE ba.bookAuthorID = ?`,
            [result.insertId]
         );

         return newResult[0];
      } catch (error) {
         console.error("Error creating book author:", error);
         throw error;
      }
   }
}

export default new BookAuthorsModel();
