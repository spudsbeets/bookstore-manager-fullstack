import BookAuthorsModel from '../models/BookAuthorsModel.js';

export async function findAll(req, res) {
  try {
    const bookAuthors = await BookAuthorsModel.findAll();
    res.json(bookAuthors);
  } catch (err) {
    console.error("Error fetching book authors:", err);
    res.status(500).json({ error: 'Failed to fetch book authors' });
  }
}

export async function findOne(req, res) {
  try {
    const bookAuthor = await BookAuthorsModel.findById(req.params.id);
    if (!bookAuthor) return res.status(404).json({ error: 'Book author not found' });
    res.json(bookAuthor);
  } catch (err) {
    console.error("Error fetching book author:", err);
    res.status(500).json({ error: 'Failed to fetch book author' });
  }
}

export async function create(req, res) {
  try {
    const bookAuthor = await BookAuthorsModel.create(req.body);
    res.status(201).json(bookAuthor);
  } catch (err) {
    console.error("Error creating book author:", err);
    res.status(400).json({ error: 'Failed to create book author' });
  }
}

export async function update(req, res) {
  try {
    const bookAuthor = await BookAuthorsModel.update(req.params.id, req.body);
    if (!bookAuthor) return res.status(404).json({ error: 'Book author not found' });
    res.json(bookAuthor);
  } catch (err) {
    console.error("Error updating book author:", err);
    res.status(400).json({ error: 'Failed to update book author' });
  }
}

export async function deleteOne(req, res) {
  try {
    const deleted = await BookAuthorsModel.deleteById(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Book author not found' });
    res.status(204).send();
  } catch (err) {
    console.error("Error deleting book author:", err);
    res.status(500).json({ error: 'Failed to delete book author' });
  }
}

export async function findByBookId(req, res) {
  try {
    const bookAuthors = await BookAuthorsModel.findByBookId(req.params.bookId);
    res.json(bookAuthors);
  } catch (err) {
    console.error("Error fetching book authors:", err);
    res.status(500).json({ error: 'Failed to fetch book authors' });
  }
}

export async function findByAuthorId(req, res) {
  try {
    const bookAuthors = await BookAuthorsModel.findByAuthorId(req.params.authorId);
    res.json(bookAuthors);
  } catch (err) {
    console.error("Error fetching book authors:", err);
    res.status(500).json({ error: 'Failed to fetch book authors' });
  }
} 