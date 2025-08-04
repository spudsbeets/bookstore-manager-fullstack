/**
 * @date August 4, 2025
 * @based_on The custom routing architecture designed for this project.
 *
 * @degree_of_originality The routing structure is original work, created to map API endpoints to the corresponding controller functions. It follows standard Express.js routing patterns but is tailored to the specific needs of this application.
 *
 * @source_url N/A - This routing implementation is based on the project's unique requirements.
 *
 * @ai_tool_usage The route files were generated using Cursor, an AI code editor, based on the defined API endpoints and controller structure. The generated code was then reviewed and refined.
 */

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
