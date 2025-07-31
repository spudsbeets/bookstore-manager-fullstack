import BaseModel from "./BaseModel.js";
import pool from "../database/db-connector.js";

class OrderItemsModel extends BaseModel {
   constructor() {
      super("OrderItems", "orderItemID");
   }

   async findByOrderId(orderId) {
      try {
         const query = `
        SELECT oi.orderItemID, oi.orderID, oi.bookID, oi.quantity, oi.price,
               b.title, o.orderDate, c.firstName, c.lastName
        FROM OrderItems oi
        INNER JOIN Books b ON oi.bookID = b.bookID
        INNER JOIN Orders o ON oi.orderID = o.orderID
        INNER JOIN Customers c ON o.customerID = c.customerID
        WHERE oi.orderID = ?
        ORDER BY oi.orderItemID
      `;
         const [results] = await pool.query(query, [orderId]);
         return results;
      } catch (error) {
         console.error("Error finding order items by order ID:", error);
         throw error;
      }
   }

   async findAll() {
      try {
         const query = `
        SELECT oi.orderItemID, oi.orderID, oi.bookID, oi.quantity, oi.price,
               b.title, o.orderDate, c.firstName, c.lastName
        FROM OrderItems oi
        INNER JOIN Books b ON oi.bookID = b.bookID
        INNER JOIN Orders o ON oi.orderID = o.orderID
        INNER JOIN Customers c ON o.customerID = c.customerID
        ORDER BY o.orderDate DESC, oi.orderItemID
      `;
         const [results] = await pool.query(query);
         return results;
      } catch (error) {
         console.error("Error finding all order items:", error);
         throw error;
      }
   }

   async findById(id) {
      try {
         const query = `
        SELECT oi.orderItemID, oi.orderID, oi.bookID, oi.quantity, oi.price,
               b.title, o.orderDate, c.firstName, c.lastName
        FROM OrderItems oi
        INNER JOIN Books b ON oi.bookID = b.bookID
        INNER JOIN Orders o ON oi.orderID = o.orderID
        INNER JOIN Customers c ON o.customerID = c.customerID
        WHERE oi.orderItemID = ?
      `;
         const [results] = await pool.query(query, [id]);
         return results.length > 0 ? results[0] : null;
      } catch (error) {
         console.error("Error finding order item by ID:", error);
         throw error;
      }
   }
}

export default new OrderItemsModel();
