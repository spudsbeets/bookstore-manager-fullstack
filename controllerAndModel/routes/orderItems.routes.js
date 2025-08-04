/**
 * @date August 4, 2025
 * @based_on The custom routing architecture designed for this project.
 *
 * @degree_of_originality The routing structure is original work, created to map API endpoints to the corresponding controller functions. It follows standard Express.js routing patterns but is tailored to the specific needs of this application.
 *
 * @source_url N/A - This routing implementation is based on the project's unique requirements.
 *
 * @ai_tool_usage The route files were generated using Cursor, an AI code editor, based on the defined API endpoints and controller structure. The generated code was then reviewed and refined.
 */

import express from "express";
import * as OrderItemsController from "../controllers/orderItems.controller.js";

const orderItemsRouter = express.Router();

orderItemsRouter
   .route("/")
   .get(OrderItemsController.findAll)
   .post(OrderItemsController.create);

orderItemsRouter
   .route("/:id")
   .get(OrderItemsController.findOne)
   .put(OrderItemsController.update)
   .delete(OrderItemsController.deleteOne);

// Get all items for a specific order
orderItemsRouter
   .route("/order/:orderId")
   .get(OrderItemsController.findByOrderId);

export default orderItemsRouter;
