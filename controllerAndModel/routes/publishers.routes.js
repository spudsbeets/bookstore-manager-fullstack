import express from 'express';
import * as PublishersController from '../controllers/publishers.controller.js';

const publishersRouter = express.Router();

publishersRouter
  .route('/')
  .get(PublishersController.findAll)
  .post(PublishersController.create);

publishersRouter
  .route('/:id')
  .get(PublishersController.findOne)
  .put(PublishersController.update)
  .delete(PublishersController.deleteOne);

export default publishersRouter; 