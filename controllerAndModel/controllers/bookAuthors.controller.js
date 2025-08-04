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

import BookAuthorsModel from "../models/BookAuthorsModel.js";

export async function findAll(req, res) {
   try {
      const bookAuthors = await BookAuthorsModel.findAll();
      res.json(bookAuthors);
   } catch (err) {
      console.error("Error fetching book authors:", err);
      res.status(500).json({ error: "Failed to fetch book authors" });
   }
}

export async function findOne(req, res) {
   try {
      const bookAuthor = await BookAuthorsModel.findById(req.params.id);
      if (!bookAuthor)
         return res.status(404).json({ error: "Book author not found" });
      res.json(bookAuthor);
   } catch (err) {
      console.error("Error fetching book author:", err);
      res.status(500).json({ error: "Failed to fetch book author" });
   }
}

export async function create(req, res) {
   try {
      const bookAuthor = await BookAuthorsModel.create(req.body);
      res.status(201).json(bookAuthor);
   } catch (err) {
      console.error("Error creating book author:", err);

      // Check if it's a duplicate relationship error
      if (err.message.includes("already exists")) {
         res.status(409).json({
            error: err.message,
            suggestion:
               "This author is already associated with this book. Please choose a different author or book.",
         });
      } else {
         res.status(400).json({ error: "Failed to create book author" });
      }
   }
}

export async function update(req, res) {
   try {
      const bookAuthor = await BookAuthorsModel.update(req.params.id, req.body);
      if (!bookAuthor)
         return res.status(404).json({ error: "Book author not found" });
      res.json(bookAuthor);
   } catch (err) {
      console.error("Error updating book author:", err);
      res.status(400).json({ error: "Failed to update book author" });
   }
}

export async function deleteOne(req, res) {
   try {
      const deleted = await BookAuthorsModel.deleteById(req.params.id);
      if (!deleted)
         return res.status(404).json({ error: "Book author not found" });
      res.status(204).send();
   } catch (err) {
      console.error("Error deleting book author:", err);
      res.status(500).json({ error: "Failed to delete book author" });
   }
}

export async function findByBookId(req, res) {
   try {
      const bookAuthors = await BookAuthorsModel.findByBookId(
         req.params.bookId
      );
      res.json(bookAuthors);
   } catch (err) {
      console.error("Error fetching book authors:", err);
      res.status(500).json({ error: "Failed to fetch book authors" });
   }
}

export async function findByAuthorId(req, res) {
   try {
      const bookAuthors = await BookAuthorsModel.findByAuthorId(
         req.params.authorId
      );
      res.json(bookAuthors);
   } catch (err) {
      console.error("Error fetching book authors:", err);
      res.status(500).json({ error: "Failed to fetch book authors" });
   }
}

export async function getBooksForDropdown(req, res) {
   try {
      const books = await BookAuthorsModel.getBooksForDropdown();
      res.json(books);
   } catch (err) {
      console.error("Error fetching books for dropdown:", err);
      res.status(500).json({ error: "Failed to fetch books for dropdown" });
   }
}

export async function getAuthorsForDropdown(req, res) {
   try {
      const authors = await BookAuthorsModel.getAuthorsForDropdown();
      res.json(authors);
   } catch (err) {
      console.error("Error fetching authors for dropdown:", err);
      res.status(500).json({ error: "Failed to fetch authors for dropdown" });
   }
}

export async function updateForBook(req, res) {
   try {
      const { bookId } = req.params;
      const { authorIds } = req.body;

      await BookAuthorsModel.updateForBook(parseInt(bookId), authorIds);
      res.json({ message: "Book authors updated successfully" });
   } catch (err) {
      console.error("Error updating book authors:", err);
      res.status(500).json({ error: "Failed to update book authors" });
   }
}
