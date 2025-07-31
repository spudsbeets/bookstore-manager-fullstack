import express from 'express';
import * as BookGenresController from '../controllers/bookGenres.controller.js';

const bookGenresRouter = express.Router();

bookGenresRouter
  .route('/')
  .get(BookGenresController.findAll)
  .post(BookGenresController.create);

bookGenresRouter
  .route('/:id')
  .get(BookGenresController.findOne)
  .put(BookGenresController.update)
  .delete(BookGenresController.deleteOne);

// Get all genres for a specific book
bookGenresRouter.route('/book/:bookId').get(BookGenresController.findByBookId);

// Get all books for a specific genre
bookGenresRouter.route('/genre/:genreId').get(BookGenresController.findByGenreId);

export default bookGenresRouter; 