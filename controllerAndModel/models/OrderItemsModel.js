import BaseModel from "./BaseModel.js";
import pool from "../database/db-connector.js";

class OrderItemsModel extends BaseModel {
   constructor() {
      super("OrderItems", "orderItemID");
   }

   async create(data) {
      try {
         const { orderID, bookID, quantity, price } = data;
         
         // Validate that the order exists
         const [orderResult] = await pool.query(
            "SELECT orderID FROM Orders WHERE orderID = ?",
            [orderID]
         );
         
         if (orderResult.length === 0) {
            throw new Error(`Order with ID ${orderID} not found`);
         }
         
         // Validate that the book exists
         const [bookResult] = await pool.query(
            "SELECT bookID FROM Books WHERE bookID = ?",
            [bookID]
         );
         
         if (bookResult.length === 0) {
            throw new Error(`Book with ID ${bookID} not found`);
         }
         
         // Calculate individual price and subtotal
         const individualPrice = price;
         const subtotal = quantity * individualPrice;
         
         // Create the order item
         const [result] = await pool.query(
            "INSERT INTO OrderItems (orderID, bookID, quantity, individualPrice, subtotal) VALUES (?, ?, ?, ?, ?)",
            [orderID, bookID, quantity, individualPrice, subtotal]
         );
         
         // Return the created order item with joined data
         const [newResult] = await pool.query(
            `SELECT oi.orderItemID, oi.orderID, oi.bookID, oi.quantity, oi.individualPrice as price,
                    b.title, o.orderDate, c.firstName, c.lastName
             FROM OrderItems oi
             INNER JOIN Books b ON oi.bookID = b.bookID
             INNER JOIN Orders o ON oi.orderID = o.orderID
             INNER JOIN Customers c ON o.customerID = c.customerID
             WHERE oi.orderItemID = ?`,
            [result.insertId]
         );
         
         return newResult[0];
      } catch (error) {
         console.error("Error creating order item:", error);
         throw error;
      }
   }

   async update(id, data) {
      try {
         const { orderID, bookID, quantity, price } = data;
         
         // Find the current order item
         const [currentResult] = await pool.query(
            "SELECT orderID, bookID, quantity, individualPrice FROM OrderItems WHERE orderItemID = ?",
            [id]
         );
         
         if (currentResult.length === 0) {
            return null;
         }
         
         let newOrderID = currentResult[0].orderID;
         let newBookID = currentResult[0].bookID;
         let newQuantity = currentResult[0].quantity;
         let newIndividualPrice = currentResult[0].individualPrice;
         
         // Update orderID if provided
         if (orderID !== undefined) {
            const [orderResult] = await pool.query(
               "SELECT orderID FROM Orders WHERE orderID = ?",
               [orderID]
            );
            
            if (orderResult.length === 0) {
               throw new Error(`Order with ID ${orderID} not found`);
            }
            
            newOrderID = orderID;
         }
         
         // Update bookID if provided
         if (bookID !== undefined) {
            const [bookResult] = await pool.query(
               "SELECT bookID FROM Books WHERE bookID = ?",
               [bookID]
            );
            
            if (bookResult.length === 0) {
               throw new Error(`Book with ID ${bookID} not found`);
            }
            
            newBookID = bookID;
         }
         
         // Update quantity if provided
         if (quantity !== undefined) {
            newQuantity = quantity;
         }
         
         // Update individualPrice if provided
         if (price !== undefined) {
            newIndividualPrice = price;
         }
         
         // Calculate new subtotal
         const subtotal = newQuantity * newIndividualPrice;
         
         // Update the order item
         await pool.query(
            "UPDATE OrderItems SET orderID = ?, bookID = ?, quantity = ?, individualPrice = ?, subtotal = ? WHERE orderItemID = ?",
            [newOrderID, newBookID, newQuantity, newIndividualPrice, subtotal, id]
         );
         
         // Return the updated order item with joined data
         const [updatedResult] = await pool.query(
            `SELECT oi.orderItemID, oi.orderID, oi.bookID, oi.quantity, oi.individualPrice as price,
                    b.title, o.orderDate, c.firstName, c.lastName
             FROM OrderItems oi
             INNER JOIN Books b ON oi.bookID = b.bookID
             INNER JOIN Orders o ON oi.orderID = o.orderID
             INNER JOIN Customers c ON o.customerID = c.customerID
             WHERE oi.orderItemID = ?`,
            [id]
         );
         
         return updatedResult[0];
      } catch (error) {
         console.error("Error updating order item:", error);
         throw error;
      }
   }

   async deleteById(id) {
      try {
         const [result] = await pool.query(
            "DELETE FROM OrderItems WHERE orderItemID = ?",
            [id]
         );
         
         return result.affectedRows > 0;
      } catch (error) {
         console.error("Error deleting order item:", error);
         throw error;
      }
   }

   async findByOrderId(orderId) {
      try {
         const query = `
        SELECT oi.orderItemID, oi.orderID, oi.bookID, oi.quantity, oi.individualPrice as price,
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
        SELECT oi.orderItemID, oi.orderID, oi.bookID, oi.quantity, oi.individualPrice as price,
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
        SELECT oi.orderItemID, oi.orderID, oi.bookID, oi.quantity, oi.individualPrice as price,
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
