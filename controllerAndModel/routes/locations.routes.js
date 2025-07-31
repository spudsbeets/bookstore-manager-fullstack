import express from 'express';
import * as LocationsController from '../controllers/locations.controller.js';

const locationsRouter = express.Router();

locationsRouter
  .route('/')
  .get(LocationsController.findAll)
  .post(LocationsController.create);

locationsRouter
  .route('/:id')
  .get(LocationsController.findOne)
  .put(LocationsController.update)
  .delete(LocationsController.deleteOne);

export default locationsRouter; 