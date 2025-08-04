/**
 * @date August 4, 2025
 * @based_on The Node.js project architecture, including the controller and model structure, from the CS 290 course materials.
 *
 * @degree_of_originality The foundational project architecture, which separates concerns into `controllers`, `models`, and `database` modules, is based on the examples and starter code provided in the CS 290 coursework. The specific implementation of each model (e.g., AuthorsModel.js, BooksModel.js) and controller (e.g., authors.controller.js, books.controller.js) to handle the application's unique business logic and database interactions is original work.
 *
 * @source_url The architectural concepts and structure were derived from course modules and examples, similar to those found at https://canvas.oregonstate.edu/courses/1967288/pages/exploration-designing-web-apps-using-mvc-and-rest-api?module_item_id=24465416
 *
 * @ai_tool_usage The controllers were generated using Cursor, an AI code editor. My own controller was provided as a template and schema for the generation, and I subsequently refined the output.
 */

import GenresModel from "../models/GenresModel.js";

export async function findAll(req, res) {
   try {
      const genres = await GenresModel.findAllOrdered();
      res.json(genres);
   } catch (err) {
      console.error("Error fetching genres:", err);
      res.status(500).json({ error: "Failed to fetch genres" });
   }
}

export async function findOne(req, res) {
   try {
      const genre = await GenresModel.findById(req.params.id);
      if (!genre) return res.status(404).json({ error: "Genre not found" });
      res.json(genre);
   } catch (err) {
      console.error("Error fetching genre:", err);
      res.status(500).json({ error: "Failed to fetch genre" });
   }
}

export async function create(req, res) {
   try {
      const genre = await GenresModel.create(req.body);
      res.status(201).json(genre);
   } catch (err) {
      console.error("Error creating genre:", err);

      // Check if it's a duplicate genre name error
      if (err.message.includes("already exists")) {
         res.status(409).json({
            error: err.message,
            suggestion:
               "Please choose a different genre name or update the existing genre.",
         });
      } else {
         res.status(400).json({ error: "Failed to create genre" });
      }
   }
}

export async function update(req, res) {
   try {
      const genre = await GenresModel.update(req.params.id, req.body);
      if (!genre) return res.status(404).json({ error: "Genre not found" });
      res.json(genre);
   } catch (err) {
      console.error("Error updating genre:", err);

      // Check if it's a duplicate genre name error
      if (err.message.includes("already exists")) {
         res.status(409).json({
            error: err.message,
            suggestion:
               "Please choose a different genre name or update the existing genre.",
         });
      } else {
         res.status(400).json({ error: "Failed to update genre" });
      }
   }
}

export async function deleteOne(req, res) {
   try {
      const deleted = await GenresModel.deleteById(req.params.id);
      if (!deleted) return res.status(404).json({ error: "Genre not found" });
      res.status(204).send();
   } catch (err) {
      console.error("Error deleting genre:", err);
      res.status(500).json({ error: "Failed to delete genre" });
   }
}
