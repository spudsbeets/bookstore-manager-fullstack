import BooksModel from '../models/BooksModel.js';

export async function findAll(req, res) {
  try {
    const books = await BooksModel.findAll();
    res.json(books);
  } catch (err) {
    console.error("Error fetching books:", err);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
}

export async function findOne(req, res) {
  try {
    const book = await BooksModel.findById(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json(book);
  } catch (err) {
    console.error("Error fetching book:", err);
    res.status(500).json({ error: 'Failed to fetch book' });
  }
}

export async function create(req, res) {
  try {
    const book = await BooksModel.create(req.body);
    res.status(201).json(book);
  } catch (err) {
    console.error("Error creating book:", err);
    res.status(400).json({ error: 'Failed to create book' });
  }
}

export async function update(req, res) {
  try {
    const book = await BooksModel.update(req.params.id, req.body);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json(book);
  } catch (err) {
    console.error("Error updating book:", err);
    res.status(400).json({ error: 'Failed to update book' });
  }
}

export async function deleteOne(req, res) {
  try {
    const deleted = await BooksModel.deleteById(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Book not found' });
    res.status(204).send();
  } catch (err) {
    console.error("Error deleting book:", err);
    res.status(500).json({ error: 'Failed to delete book' });
  }
} 