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
   .get(BookAuthorsController.findByBookId)
   .put(BookAuthorsController.updateForBook);

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
