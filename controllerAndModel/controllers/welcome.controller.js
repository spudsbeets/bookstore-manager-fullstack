export async function welcome(req, res) {
  res.json({
    message: "Welcome to the Bookstore Management API",
    version: "v1",
    endpoints: {
      health: "/health",
      reset: "/api/v1/reset",
      books: "/api/v1/books",
      authors: "/api/v1/authors",
      publishers: "/api/v1/publishers",
      customers: "/api/v1/customers",
      genres: "/api/v1/genres",
      orders: "/api/v1/orders",
      salesRates: "/api/v1/sales-rates",
      locations: "/api/v1/locations",
      bookAuthors: "/api/v1/book-authors",
      bookGenres: "/api/v1/book-genres",
      orderItems: "/api/v1/order-items",
      search: "/api/v1/search"
    }
  });
} 