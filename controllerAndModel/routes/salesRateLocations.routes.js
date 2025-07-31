import express from 'express';
import * as SalesRateLocationsController from '../controllers/salesRateLocations.controller.js';

const salesRateLocationsRouter = express.Router();

salesRateLocationsRouter
  .route('/')
  .get(SalesRateLocationsController.findAll)
  .post(SalesRateLocationsController.create);

salesRateLocationsRouter
  .route('/:id')
  .get(SalesRateLocationsController.findOne)
  .put(SalesRateLocationsController.update)
  .delete(SalesRateLocationsController.deleteOne);

export default salesRateLocationsRouter; 