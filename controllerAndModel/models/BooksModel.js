import BaseModel from "./BaseModel.js";
import pool from "../database/db-connector.js";

class BooksModel extends BaseModel {
   constructor() {
      super("Books", "bookID");
   }

   // Override findAll to include publisher and relationships
   async findAll() {
      try {
         const [rows] = await pool.query(`
                SELECT
                    b.bookID,
                    b.title,
                    b.publicationDate,
                    b.\`isbn-10\`,
                    b.\`isbn-13\`,
                    b.price,
                    b.inventoryQty,
                    p.publisherName AS publisher,
                    GROUP_CONCAT(DISTINCT a.fullName SEPARATOR ', ') AS authors,
                    GROUP_CONCAT(DISTINCT g.genreName SEPARATOR ', ') AS genres
                FROM Books b
                LEFT JOIN Publishers p ON b.publisherID = p.publisherID
                LEFT JOIN BookAuthors ba ON b.bookID = ba.bookID
                LEFT JOIN Authors a ON ba.authorID = a.authorID
                LEFT JOIN BookGenres bg ON b.bookID = bg.bookID
                LEFT JOIN Genres g ON bg.genreID = g.genreID
                GROUP BY b.bookID
            `);
         return rows;
      } catch (error) {
         console.error("Error fetching books:", error);
         throw error;
      }
   }

   // Override findById to include publisher
   async findById(id) {
      try {
         const [rows] = await pool.query(
            `
                SELECT b.*, p.publisherName 
                FROM Books b 
                LEFT JOIN Publishers p ON b.publisherID = p.publisherID
                WHERE b.bookID = ?
            `,
            [id]
         );
         return rows.length > 0 ? rows[0] : null;
      } catch (error) {
         console.error("Error fetching book by ID:", error);
         throw error;
      }
   }

   // Custom methods for Books
   async findByTitle(title) {
      try {
         const [rows] = await pool.query(
            `
                SELECT b.*, p.publisherName 
                FROM Books b 
                LEFT JOIN Publishers p ON b.publisherID = p.publisherID
                WHERE b.title LIKE ?
            `,
            [`%${title}%`]
         );
         return rows;
      } catch (error) {
         console.error("Error finding books by title:", error);
         throw error;
      }
   }

   async findByPublisher(publisherId) {
      try {
         const [rows] = await pool.query(
            `
                SELECT b.*, p.publisherName 
                FROM Books b 
                LEFT JOIN Publishers p ON b.publisherID = p.publisherID
                WHERE b.publisherID = ?
            `,
            [publisherId]
         );
         return rows;
      } catch (error) {
         console.error("Error finding books by publisher:", error);
         throw error;
      }
   }

   async findInStock() {
      try {
         const [rows] = await pool.query(`
                SELECT b.*, p.publisherName 
                FROM Books b 
                LEFT JOIN Publishers p ON b.publisherID = p.publisherID
                WHERE b.inStock = 1
            `);
         return rows;
      } catch (error) {
         console.error("Error finding books in stock:", error);
         throw error;
      }
   }
}

export default new BooksModel();
