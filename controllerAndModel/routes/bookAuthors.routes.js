import express from "express";
import * as BookAuthorsController from "../controllers/bookAuthors.controller.js";

const bookAuthorsRouter = express.Router();

bookAuthorsRouter
   .route("/")
   .get(BookAuthorsController.findAll)
   .post(BookAuthorsController.create);

bookAuthorsRouter
   .route("/:id")
   .get(BookAuthorsController.findOne)
   .put(BookAuthorsController.update)
   .delete(BookAuthorsController.deleteOne);

// Get all authors for a specific book
bookAuthorsRouter
   .route("/book/:bookId")
   .get(BookAuthorsController.findByBookId);

// Get all books for a specific author
bookAuthorsRouter
   .route("/author/:authorId")
   .get(BookAuthorsController.findByAuthorId);

// Get books and authors for dropdowns
bookAuthorsRouter
   .route("/books/dropdown")
   .get(BookAuthorsController.getBooksForDropdown);
bookAuthorsRouter
   .route("/authors/dropdown")
   .get(BookAuthorsController.getAuthorsForDropdown);

export default bookAuthorsRouter;
