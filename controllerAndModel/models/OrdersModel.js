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
}

export default new OrdersModel();
