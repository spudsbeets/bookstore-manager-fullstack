import express from 'express';
import * as BooksController from '../controllers/books.controller.js';

const booksRouter = express.Router();

booksRouter
  .route('/')
  .get(BooksController.findAll)
  .post(BooksController.create);

booksRouter
  .route('/:id')
  .get(BooksController.findOne)
  .put(BooksController.update)
  .delete(BooksController.deleteOne);

export default booksRouter; 