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

class OrdersModel extends BaseModel {
   constructor() {
      super("Orders", "orderID");
   }

   // Override findAll to include customer information
   async findAll() {
      try {
         const [rows] = await pool.query(`
                SELECT o.*, c.firstName, c.lastName, 
                       CONCAT(c.firstName, ' ', c.lastName) as customerName,
                       s.county, s.state
                FROM Orders o
                LEFT JOIN Customers c ON o.customerID = c.customerID
                LEFT JOIN SalesRateLocations s ON o.salesRateID = s.salesRateID
                ORDER BY o.orderDate DESC, o.orderTime DESC
            `);
         return rows;
      } catch (error) {
         console.error("Error fetching orders:", error);
         throw error;
      }
   }

   // Override findById to include customer information
   async findById(id) {
      try {
         const [rows] = await pool.query(
            `
                SELECT o.*, c.firstName, c.lastName, 
                       CONCAT(c.firstName, ' ', c.lastName) as customerName,
                       s.county, s.state
                FROM Orders o
                LEFT JOIN Customers c ON o.customerID = c.customerID
                LEFT JOIN SalesRateLocations s ON o.salesRateID = s.salesRateID
                WHERE o.orderID = ?
            `,
            [id]
         );
         return rows.length > 0 ? rows[0] : null;
      } catch (error) {
         console.error("Error fetching order by ID:", error);
         throw error;
      }
   }

   // Custom methods for Orders
   async findByCustomer(customerId) {
      try {
         const [rows] = await pool.query(
            `
                SELECT o.*, c.firstName, c.lastName, 
                       CONCAT(c.firstName, ' ', c.lastName) as customerName,
                       s.county, s.state
                FROM Orders o
                LEFT JOIN Customers c ON o.customerID = c.customerID
                LEFT JOIN SalesRateLocations s ON o.salesRateID = s.salesRateID
                WHERE o.customerID = ?
                ORDER BY o.orderDate DESC, o.orderTime DESC
            `,
            [customerId]
         );
         return rows;
      } catch (error) {
         console.error("Error finding orders by customer:", error);
         throw error;
      }
   }

   async findByDateRange(startDate, endDate) {
      try {
         const [rows] = await pool.query(
            `
                SELECT o.*, c.firstName, c.lastName, 
                       CONCAT(c.firstName, ' ', c.lastName) as customerName,
                       s.county, s.state
                FROM Orders o
                LEFT JOIN Customers c ON o.customerID = c.customerID
                LEFT JOIN SalesRateLocations s ON o.salesRateID = s.salesRateID
                WHERE o.orderDate BETWEEN ? AND ?
                ORDER BY o.orderDate DESC, o.orderTime DESC
            `,
            [startDate, endDate]
         );
         return rows;
      } catch (error) {
         console.error("Error finding orders by date range:", error);
         throw error;
      }
   }

   // Override create method to use stored procedure
   async create(data) {
      try {
         // Call the specific stored procedure for Orders
         const [result] = await pool.query(
            "CALL sp_dynamic_create_orders(?)",
            [JSON.stringify(data)]
         );
         
         // Extract the result from the stored procedure
         const jsonResult = result[0][0].result;
         const parsedResult = JSON.parse(jsonResult);
         
         return { id: parsedResult.id, ...data };
      } catch (error) {
         console.error(`Error creating ${this.tableName}:`, error);
         throw error;
      }
   }

   // Override update method to use stored procedure
   async update(id, data) {
      try {
         // Call the specific stored procedure for Orders
         const [result] = await pool.query(
            "CALL sp_dynamic_update_orders(?, ?)",
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
         console.error(`Error updating ${this.tableName}:`, error);
         throw error;
      }
   }

   // Override deleteById method to use stored procedure
   async deleteById(id) {
      try {
         // Call the stored procedure
         await pool.query("CALL sp_deleteOrder(?)", [id]);
         return true; // If no error, deletion was successful
      } catch (error) {
         console.error("Error deleting order:", error);
         throw error;
      }
   }
}

export default new OrdersModel();
