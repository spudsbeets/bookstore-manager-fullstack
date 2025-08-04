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

import AuthorsModel from "../models/AuthorsModel.js";

export async function findAll(req, res) {
   try {
      const authors = await AuthorsModel.findAll();
      res.json(authors);
   } catch (err) {
      console.error("Error fetching authors:", err);
      res.status(500).json({ error: "Failed to fetch authors" });
   }
}

export async function findOne(req, res) {
   try {
      const author = await AuthorsModel.findById(req.params.id);
      if (!author) return res.status(404).json({ error: "Author not found" });
      res.json(author);
   } catch (err) {
      console.error("Error fetching author:", err);
      res.status(500).json({ error: "Failed to fetch author" });
   }
}

export async function create(req, res) {
   try {
      const author = await AuthorsModel.create(req.body);
      res.status(201).json(author);
   } catch (err) {
      console.error("Error creating author:", err);
      res.status(400).json({ error: "Failed to create author" });
   }
}

export async function update(req, res) {
   try {
      const author = await AuthorsModel.update(req.params.id, req.body);
      if (!author) return res.status(404).json({ error: "Author not found" });
      res.json(author);
   } catch (err) {
      console.error("Error updating author:", err);
      res.status(400).json({ error: "Failed to update author" });
   }
}

export async function deleteOne(req, res) {
   try {
      const deleted = await AuthorsModel.deleteById(req.params.id);
      if (!deleted) return res.status(404).json({ error: "Author not found" });
      res.status(204).send();
   } catch (err) {
      console.error("Error deleting author:", err);
      res.status(500).json({ error: "Failed to delete author" });
   }
}

export async function findAllForDropdown(req, res) {
   try {
      const authors = await AuthorsModel.findAllWithFullName();
      res.json(authors);
   } catch (err) {
      console.error("Error fetching authors for dropdown:", err);
      res.status(500).json({ error: "Failed to fetch authors" });
   }
}
