import express from "express";
import * as BooksController from "../controllers/books.controller.js";
import * as BookAuthorsController from "../controllers/bookAuthors.controller.js";
import * as BookGenresController from "../controllers/bookGenres.controller.js";

const booksRouter = express.Router();

booksRouter
   .route("/")
   .get(BooksController.findAll)
   .post(BooksController.create);

booksRouter
   .route("/:id")
   .get(BooksController.findOne)
   .put(BooksController.update)
   .delete(BooksController.deleteOne);

// Get authors for a specific book
booksRouter.get("/:id/authors", BookAuthorsController.findByBookId);

// Get genres for a specific book
booksRouter.get("/:id/genres", BookGenresController.findByBookId);

export default booksRouter;
