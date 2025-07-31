import express from 'express';
import * as BookAuthorsController from '../controllers/bookAuthors.controller.js';

const bookAuthorsRouter = express.Router();

bookAuthorsRouter
  .route('/')
  .get(BookAuthorsController.findAll)
  .post(BookAuthorsController.create);

bookAuthorsRouter
  .route('/:id')
  .get(BookAuthorsController.findOne)
  .put(BookAuthorsController.update)
  .delete(BookAuthorsController.deleteOne);

// Get all authors for a specific book
bookAuthorsRouter.route('/book/:bookId').get(BookAuthorsController.findByBookId);

// Get all books for a specific author
bookAuthorsRouter.route('/author/:authorId').get(BookAuthorsController.findByAuthorId);

export default bookAuthorsRouter; 