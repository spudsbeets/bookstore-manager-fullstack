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
import {
   findAll,
   findOne,
   create,
   update,
   deleteOne,
   findByBookId,
   findByLocationId,
} from "../controllers/bookLocations.controller.js";

const router = express.Router();

// GET all book locations
router.get("/", findAll);

// GET book location by ID
router.get("/:id", findOne);

// POST create new book location
router.post("/", create);

// PUT update book location
router.put("/:id", update);

// DELETE book location
router.delete("/:id", deleteOne);

// GET book locations by book ID
router.get("/book/:bookId", findByBookId);

// GET book locations by location ID
router.get("/location/:locationId", findByLocationId);

export default router;
