import express from "express";
import * as BookGenresController from "../controllers/bookGenres.controller.js";

const bookGenresRouter = express.Router();

bookGenresRouter
   .route("/")
   .get(BookGenresController.findAll)
   .post(BookGenresController.create);

bookGenresRouter
   .route("/:id")
   .get(BookGenresController.findOne)
   .put(BookGenresController.update)
   .delete(BookGenresController.deleteOne);

// Get all genres for a specific book
bookGenresRouter
   .route("/book/:bookId")
   .get(BookGenresController.findByBookId)
   .put(BookGenresController.updateForBook);

// Get all books for a specific genre
bookGenresRouter
   .route("/genre/:genreId")
   .get(BookGenresController.findByGenreId);

// Get books and genres for dropdowns
bookGenresRouter
   .route("/books/dropdown")
   .get(BookGenresController.getBooksForDropdown);
bookGenresRouter
   .route("/genres/dropdown")
   .get(BookGenresController.getGenresForDropdown);

export default bookGenresRouter;
