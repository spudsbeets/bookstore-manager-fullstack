import express from 'express';
import * as CustomersController from '../controllers/customers.controller.js';

const customersRouter = express.Router();

customersRouter
  .route('/')
  .get(CustomersController.findAll)
  .post(CustomersController.create);

customersRouter
  .route('/:id')
  .get(CustomersController.findOne)
  .put(CustomersController.update)
  .delete(CustomersController.deleteOne);

customersRouter.route('/dropdown').get(CustomersController.findAllForDropdown);

export default customersRouter; 