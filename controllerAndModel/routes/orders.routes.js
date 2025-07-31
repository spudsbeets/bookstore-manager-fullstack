import express from 'express';
import * as OrdersController from '../controllers/orders.controller.js';

const ordersRouter = express.Router();

ordersRouter
  .route('/')
  .get(OrdersController.findAll)
  .post(OrdersController.create);

ordersRouter
  .route('/:id')
  .get(OrdersController.findOne)
  .put(OrdersController.update)
  .delete(OrdersController.deleteOne);

export default ordersRouter; 