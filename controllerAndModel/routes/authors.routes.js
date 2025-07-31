import express from 'express';
import * as AuthorsController from '../controllers/authors.controller.js';

const authorsRouter = express.Router();

authorsRouter
  .route('/')
  .get(AuthorsController.findAll)
  .post(AuthorsController.create);

authorsRouter
  .route('/:id')
  .get(AuthorsController.findOne)
  .put(AuthorsController.update)
  .delete(AuthorsController.deleteOne);

authorsRouter.route('/dropdown').get(AuthorsController.findAllForDropdown);

export default authorsRouter; 