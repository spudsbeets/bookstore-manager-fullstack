import db from '../database/db-connector.js';

export async function search(req, res) {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: "Search query is required" });
    }

    const searchTerm = `%${q}%`;
    const query = `
      SELECT DISTINCT
        b.bookID,
        b.title,
        b.publicationDate,
        b.\`isbn-10\`,
        b.\`isbn-13\`,
        b.price,
        b.inventoryQty,
        p.publisherName AS publisher,
        GROUP_CONCAT(DISTINCT a.fullName SEPARATOR ', ') AS authors,
        GROUP_CONCAT(DISTINCT g.genreName SEPARATOR ', ') AS genres
      FROM Books b
      LEFT JOIN Publishers p ON b.publisherID = p.publisherID
      LEFT JOIN BookAuthors ba ON b.bookID = ba.bookID
      LEFT JOIN Authors a ON ba.authorID = a.authorID
      LEFT JOIN BookGenres bg ON b.bookID = bg.bookID
      LEFT JOIN Genres g ON bg.genreID = g.genreID
      WHERE b.title LIKE ? OR 
            a.fullName LIKE ? OR 
            b.\`isbn-10\` LIKE ? OR 
            b.\`isbn-13\` LIKE ?
      GROUP BY b.bookID
    `;

    const [books] = await db.query(query, [
      searchTerm,
      searchTerm,
      searchTerm,
      searchTerm,
    ]);
    res.json(books);
  } catch (error) {
    console.error("Error searching books:", error);
    res.status(500).json({ error: "Failed to search books" });
  }
} 