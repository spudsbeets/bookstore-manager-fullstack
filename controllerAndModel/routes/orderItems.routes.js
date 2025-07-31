import express from 'express';
import * as OrderItemsController from '../controllers/orderItems.controller.js';

const orderItemsRouter = express.Router();

orderItemsRouter
  .route('/')
  .get(OrderItemsController.findAll)
  .post(OrderItemsController.create);

orderItemsRouter
  .route('/:id')
  .get(OrderItemsController.findOne)
  .put(OrderItemsController.update)
  .delete(OrderItemsController.deleteOne);

// Get all items for a specific order
orderItemsRouter.route('/order/:orderId').get(OrderItemsController.findByOrderId);

export default orderItemsRouter; 