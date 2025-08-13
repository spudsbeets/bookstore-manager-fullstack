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

class OrderItemsModel extends BaseModel {
   constructor() {
      super("OrderItems", "orderItemID");
   }

   async create(data) {
      try {
         const { orderID, bookID, quantity, individualPrice } = data;

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
         const price = individualPrice;
         const subtotal = quantity * price;

         // Call the specific stored procedure for OrderItems
         const [result] = await pool.query(
            "CALL sp_dynamic_create_order_items(?)",
            [JSON.stringify({ orderID, bookID, quantity, individualPrice: price, subtotal })]
         );
         
         // Extract the result from the stored procedure
         const jsonResult = result[0][0].result;
         const parsedResult = JSON.parse(jsonResult);

         // Return the created order item with joined data
         const [newResult] = await pool.query(
            `SELECT oi.orderItemID, oi.orderID, oi.bookID, oi.quantity, oi.individualPrice, oi.subtotal,
                    b.title, o.orderDate, c.firstName, c.lastName
             FROM OrderItems oi
             INNER JOIN Books b ON oi.bookID = b.bookID
             INNER JOIN Orders o ON oi.orderID = o.orderID
             INNER JOIN Customers c ON o.customerID = c.customerID
             WHERE oi.orderItemID = ?`,
            [parsedResult.id]
         );

         return newResult[0];
      } catch (error) {
         console.error("Error creating order item:", error);
         throw error;
      }
   }

   async update(id, data) {
      try {
         const { orderID, bookID, quantity, individualPrice } = data;

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
         if (individualPrice !== undefined) {
            newIndividualPrice = individualPrice;
         }

         // Calculate new subtotal
         const subtotal = newQuantity * newIndividualPrice;

         // Call the specific stored procedure for OrderItems
         const [result] = await pool.query(
            "CALL sp_dynamic_update_order_items(?, ?)",
            [id, JSON.stringify({ orderID: newOrderID, bookID: newBookID, quantity: newQuantity, individualPrice: newIndividualPrice, subtotal })]
         );
         
         // Extract the result from the stored procedure
         const jsonResult = result[0][0].result;
         
         if (!jsonResult) {
            return null;
         }

         // Return the updated order item with joined data
         const [updatedResult] = await pool.query(
            `SELECT oi.orderItemID, oi.orderID, oi.bookID, oi.quantity, oi.individualPrice, oi.subtotal,
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
         await pool.query("CALL sp_deleteOrderItem(?)", [id]);
         return true;
      } catch (error) {
         console.error("Error deleting order item:", error);
         throw error;
      }
   }

   async findByOrderId(orderId) {
      try {
         const query = `
        SELECT oi.orderItemID, oi.orderID, oi.bookID, oi.quantity, oi.individualPrice, oi.subtotal,
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
        SELECT oi.orderItemID, oi.orderID, oi.bookID, oi.quantity, oi.individualPrice, oi.subtotal,
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
        SELECT oi.orderItemID, oi.orderID, oi.bookID, oi.quantity, oi.individualPrice, oi.subtotal,
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
