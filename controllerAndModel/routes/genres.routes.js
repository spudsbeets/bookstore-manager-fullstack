import express from 'express';
import * as GenresController from '../controllers/genres.controller.js';

const genresRouter = express.Router();

genresRouter
  .route('/')
  .get(GenresController.findAll)
  .post(GenresController.create);

genresRouter
  .route('/:id')
  .get(GenresController.findOne)
  .put(GenresController.update)
  .delete(GenresController.deleteOne);

export default genresRouter; 