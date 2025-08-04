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
import * as AuthorsController from "../controllers/authors.controller.js";

const authorsRouter = express.Router();

authorsRouter
   .route("/")
   .get(AuthorsController.findAll)
   .post(AuthorsController.create);

authorsRouter
   .route("/:id")
   .get(AuthorsController.findOne)
   .put(AuthorsController.update)
   .delete(AuthorsController.deleteOne);

authorsRouter.route("/dropdown").get(AuthorsController.findAllForDropdown);

export default authorsRouter;
