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

   // Override create method to handle column names with hyphens
   async create(data) {
      try {
         const columns = Object.keys(data)
            .map((col) => {
               // Wrap column names with hyphens in backticks
               if (col.includes("-")) {
                  return `\`${col}\``;
               }
               return col;
            })
            .join(", ");

         const placeholders = Object.keys(data)
            .map(() => "?")
            .join(", ");
         const values = Object.values(data);

         const [result] = await pool.query(
            `INSERT INTO ${this.tableName} (${columns}) VALUES (${placeholders})`,
            values
         );

         return { id: result.insertId, ...data };
      } catch (error) {
         console.error(`Error creating ${this.tableName}:`, error);
         throw error;
      }
   }

   // Override update method to handle column names with hyphens
   async update(id, data) {
      try {
         const setClause = Object.keys(data)
            .map((key) => {
               // Wrap column names with hyphens in backticks
               if (key.includes("-")) {
                  return `\`${key}\` = ?`;
               }
               return `${key} = ?`;
            })
            .join(", ");
         const values = [...Object.values(data), id];

         const [result] = await pool.query(
            `UPDATE ${this.tableName} SET ${setClause} WHERE ${this.idColumn} = ?`,
            values
         );

         if (result.affectedRows === 0) {
            return null;
         }

         return { id, ...data };
      } catch (error) {
         console.error(`Error updating ${this.tableName}:`, error);
         throw error;
      }
   }
}

export default new BooksModel();
