-- citation https://gemini.google.com/share/db2e324490c1

-- get all books for the browse/list books page
-- uses GROUP_CONCAT to display all authors and genres for each book
SELECT
    b.bookID,
    b.title,
    b.publicationDate,
    b.`isbn-10`,
    b.`isbn-13`,
    b.price,
    b.inventoryQty,
    p.publisherName AS publisher,
    GROUP_CONCAT(DISTINCT a.fullName SEPARATOR ', ') AS authors,
    GROUP_CONCAT(DISTINCT g.genreName SEPARATOR ', ') AS genres
FROM
    Books b
LEFT JOIN Publishers p ON b.publisherID = p.publisherID
LEFT JOIN BookAuthors ba ON b.bookID = ba.bookID
LEFT JOIN Authors a ON ba.authorID = a.authorID
LEFT JOIN BookGenres bg ON b.bookID = bg.bookID
LEFT JOIN Genres g ON bg.genreID = g.genreID
GROUP BY
    b.bookID;

-- get a single book's data for the update book form
SELECT bookID, title, publicationDate, `isbn-10`, `isbn-13`, price, inventoryQty, publisherID
FROM Books
WHERE bookID = :book_ID_from_list_page;

-- get all book IDs and titles to populate a dropdown menu
SELECT bookID, title FROM Books;

-- add a new book
INSERT INTO Books (title, publicationDate, `isbn-10`, `isbn-13`, price, inventoryQty, publisherID, inStock)
VALUES (:titleInput, :publicationDateInput, :isbn10Input, :isbn13Input, :priceInput, :inventoryQtyInput, :publisher_id_from_dropdown, :inStockInput);

-- update a book's data
UPDATE Books
SET title = :titleInput, publicationDate = :publicationDateInput, price = :priceInput, inventoryQty = :inventoryQtyInput, publisherID = :publisher_id_from_dropdown
WHERE bookID = :book_ID_from_the_update_form;

-- delete a book
-- Note: This will fail if the book is part of an existing order due to the ON DELETE RESTRICT constraint on OrderItems.
DELETE FROM Books WHERE bookID = :book_ID_from_list_page;

-- get all authors to display on the authors page
SELECT authorID, firstName, middleName, lastName FROM Authors;

-- Authros
-- get all author IDs and full names to populate a dropdown
SELECT authorID, fullName FROM Authors;

-- add a new author
INSERT INTO Authors (firstName, middleName, lastName)
VALUES (:firstNameInput, :middleNameInput, :lastNameInput);

-- update an author's data
UPDATE Authors
SET firstName = :firstNameInput, middleName = :middleNameInput, lastName = :lastNameInput
WHERE authorID = :author_ID_from_the_update_form;

-- delete an author
-- Note: This will also delete any associations in the BookAuthors table (ON DELETE CASCADE).
DELETE FROM Authors WHERE authorID = :author_ID_from_list_page;

-- Customers                                       --
-- get all customers to display on the customers page
SELECT customerID, firstName, lastName, email, phoneNumber FROM Customers;

-- add a new customer
INSERT INTO Customers (firstName, lastName, email, phoneNumber)
VALUES (:firstNameInput, :lastNameInput, :emailInput, :phoneInput);

-- update a customer's data
UPDATE Customers
SET firstName = :firstNameInput, lastName = :lastNameInput, email = :emailInput, phoneNumber = :phoneInput
WHERE customerID = :customer_ID_from_the_update_form;

-- delete a customer
-- Note: This will fail if the customer has placed any orders (ON DELETE RESTRICT).
DELETE FROM Customers WHERE customerID = :customer_ID_from_list_page;

-- Orders                               --
-- get all orders for the main orders page
SELECT o.orderID, o.orderDate, o.orderTime, c.firstName, c.lastName, o.total
FROM Orders o
INNER JOIN Customers c ON o.customerID = c.customerID;

-- get all items for a single order
SELECT oi.quantity, oi.individualPrice, oi.subtotal, b.title
FROM OrderItems oi
INNER JOIN Books b ON oi.bookID = b.bookID
WHERE oi.orderID = :order_ID_from_orders_page;

-- add a new order (this is a multi-query process)
-- 1. Create the main order record
INSERT INTO Orders (orderDate, orderTime, total, taxRate, customerID, salesRateID)
VALUES (:orderDateInput, :orderTimeInput, :totalInput, :taxRate_from_location, :customer_id_from_dropdown, :sales_rate_id_from_location);

-- 2. Add items to the order (run this for each book in the cart)
INSERT INTO OrderItems (orderID, bookID, quantity, individualPrice, subtotal)
VALUES (:orderID_from_step_1, :book_id_from_cart, :quantityInput, :price_at_time_of_sale, :subtotalInput);

-- 3. Update inventory for each item sold
UPDATE Books SET inventoryQty = inventoryQty - :quantityInput WHERE bookID = :book_id_from_cart;

-- delete an order
-- Note: This will also delete all associated OrderItems (ON DELETE CASCADE).
DELETE FROM Orders WHERE orderID = :order_ID_from_orders_page;

-- Book Authors                                    --
-- get all books with their currently associated authors
SELECT ba.bookAuthorID, b.title, a.fullName AS author
FROM BookAuthors ba
INNER JOIN Books b ON ba.bookID = b.bookID
INNER JOIN Authors a ON ba.authorID = a.authorID
ORDER BY b.title, author;

-- associate an author with a book
INSERT INTO BookAuthors (bookID, authorID)
VALUES (:book_id_from_dropdown, :author_id_from_dropdown);

-- disassociate an author from a book
DELETE FROM BookAuthors WHERE bookID = :book_ID_selected_from_list AND authorID = :author_ID_selected_from_list;
-- Or, using the primary key of the intersection table:
DELETE FROM BookAuthors WHERE bookAuthorID = :bookAuthorID_from_list;

-- Genres                                    --
-- get all genres to populate a dropdown or list
SELECT genreID, genreName FROM Genres;

-- add a new genre
INSERT INTO Genres (genreName) VALUES (:genreNameInput);

-- associate a genre with a book
INSERT INTO BookGenres (bookID, genreID)
VALUES (:book_id_from_dropdown, :genre_id_from_dropdown);

-- disassociate a genre from a book
DELETE FROM BookGenres WHERE bookID = :book_ID_selected_from_list AND genreID = :genre_ID_selected_from_list;

-- get all publishers to populate a dropdown
SELECT publisherID, publisherName FROM Publishers;

-- add a new publisher
INSERT INTO Publishers (publisherName) VALUES (:publisherNameInput);

-- get all sales tax locations
SELECT salesRateID, county, state, taxRate FROM SalesRateLocations;

-- add a new sales tax location
INSERT INTO SalesRateLocations (county, state, taxRate) VALUES (:countyInput, :stateInput, :taxRateInput);

-- get all store locations (SLOCS)
SELECT slocID, slocName FROM SLOCS;

-- add a new store location
INSERT INTO SLOCS (slocName) VALUES (:slocNameInput);

-- associate a book with a store location and set its quantity
INSERT INTO BookLocations (bookID, slocID, quantity)
VALUES (:book_id_from_dropdown, :sloc_id_from_dropdown, :quantityInput);

-- update the quantity of a book at a specific location
UPDATE BookLocations SET quantity = :quantityInput
WHERE bookID = :book_id_from_list AND slocID = :sloc_id_from_list;

-- ADDITIONAL USEFUL QUERIES FOR THE APPLICATION --

-- Search functionality for books
-- Search books by title, author, or ISBN
SELECT DISTINCT
    b.bookID,
    b.title,
    b.publicationDate,
    b.`isbn-10`,
    b.`isbn-13`,
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
WHERE b.title LIKE :search_term OR 
      a.fullName LIKE :search_term OR 
      b.`isbn-10` LIKE :search_term OR 
      b.`isbn-13` LIKE :search_term
GROUP BY b.bookID;

-- Get books with low inventory (for inventory management)
SELECT bookID, title, inventoryQty, price
FROM Books
WHERE inventoryQty <= :low_inventory_threshold
ORDER BY inventoryQty ASC;

-- Get books that are out of stock
SELECT bookID, title, inventoryQty, price
FROM Books
WHERE inventoryQty = 0 OR inStock = 0
ORDER BY title;

-- Get total inventory value
SELECT SUM(inventoryQty * price) as total_inventory_value
FROM Books;

-- Get customer order history
SELECT o.orderID, o.orderDate, o.orderTime, o.total,
       GROUP_CONCAT(b.title SEPARATOR ', ') as books_ordered
FROM Orders o
INNER JOIN OrderItems oi ON o.orderID = oi.orderID
INNER JOIN Books b ON oi.bookID = b.bookID
WHERE o.customerID = :customer_ID
GROUP BY o.orderID
ORDER BY o.orderDate DESC, o.orderTime DESC;

-- Get top selling books
SELECT b.bookID, b.title, SUM(oi.quantity) as total_sold
FROM Books b
INNER JOIN OrderItems oi ON b.bookID = oi.bookID
GROUP BY b.bookID, b.title
ORDER BY total_sold DESC
LIMIT :limit_count;

-- Get sales by date range
SELECT DATE(o.orderDate) as sale_date, 
       COUNT(DISTINCT o.orderID) as orders_count,
       SUM(o.total) as total_sales
FROM Orders o
WHERE o.orderDate BETWEEN :start_date AND :end_date
GROUP BY DATE(o.orderDate)
ORDER BY sale_date;

-- Get inventory by location
SELECT bl.bookLocationID, b.title, s.slocName, bl.quantity
FROM BookLocations bl
INNER JOIN Books b ON bl.bookID = b.bookID
INNER JOIN SLOCS s ON bl.slocID = s.slocID
ORDER BY s.slocName, b.title;

-- Get books by genre
SELECT b.bookID, b.title, g.genreName
FROM Books b
INNER JOIN BookGenres bg ON b.bookID = bg.bookID
INNER JOIN Genres g ON bg.genreID = g.genreID
WHERE g.genreID = :genre_ID
ORDER BY b.title;

-- Get books by author
SELECT b.bookID, b.title, a.fullName as author
FROM Books b
INNER JOIN BookAuthors ba ON b.bookID = ba.bookID
INNER JOIN Authors a ON ba.authorID = a.authorID
WHERE a.authorID = :author_ID
ORDER BY b.title;

-- Get order details with customer and location info
SELECT o.orderID, o.orderDate, o.orderTime, o.total, o.taxRate,
       c.firstName, c.lastName, c.email,
       srl.county, srl.state
FROM Orders o
INNER JOIN Customers c ON o.customerID = c.customerID
INNER JOIN SalesRateLocations srl ON o.salesRateID = srl.salesRateID
WHERE o.orderID = :order_ID;

-- Update book stock status based on inventory quantity
UPDATE Books 
SET inStock = CASE 
    WHEN inventoryQty > 0 THEN 1 
    ELSE 0 
END;

-- Get books that need to be restocked (below minimum threshold)
SELECT bookID, title, inventoryQty, price
FROM Books
WHERE inventoryQty <= :minimum_threshold
ORDER BY inventoryQty ASC;

-- Get total sales by customer
SELECT c.customerID, c.firstName, c.lastName, 
       COUNT(o.orderID) as total_orders,
       SUM(o.total) as total_spent
FROM Customers c
LEFT JOIN Orders o ON c.customerID = o.customerID
GROUP BY c.customerID, c.firstName, c.lastName
ORDER BY total_spent DESC;

-- Get books with their current locations and quantities
SELECT b.bookID, b.title, 
       GROUP_CONCAT(CONCAT(s.slocName, ': ', bl.quantity) SEPARATOR '; ') as locations
FROM Books b
LEFT JOIN BookLocations bl ON b.bookID = bl.bookID
LEFT JOIN SLOCS s ON bl.slocID = s.slocID
GROUP BY b.bookID, b.title
ORDER BY b.title;

-- DROPDOWN QUERIES FOR UPDATE FORMS --

-- Get all available authors for book author dropdown (excluding already associated ones)
SELECT a.authorID, a.fullName
FROM Authors a
WHERE a.authorID NOT IN (
    SELECT ba.authorID 
    FROM BookAuthors ba 
    WHERE ba.bookID = :current_book_ID
)
ORDER BY a.fullName;

-- Get all available genres for book genre dropdown (excluding already associated ones)
SELECT g.genreID, g.genreName
FROM Genres g
WHERE g.genreID NOT IN (
    SELECT bg.genreID 
    FROM BookGenres bg 
    WHERE bg.bookID = :current_book_ID
)
ORDER BY g.genreName;

-- Get all available locations for book location dropdown (excluding already associated ones)
SELECT s.slocID, s.slocName
FROM SLOCS s
WHERE s.slocID NOT IN (
    SELECT bl.slocID 
    FROM BookLocations bl 
    WHERE bl.bookID = :current_book_ID
)
ORDER BY s.slocName;

-- Get all available books for order items dropdown (excluding already added ones)
SELECT b.bookID, b.title, b.price, b.inventoryQty
FROM Books b
WHERE b.bookID NOT IN (
    SELECT oi.bookID 
    FROM OrderItems oi 
    WHERE oi.orderID = :current_order_ID
)
AND b.inventoryQty > 0
ORDER BY b.title;

-- Get all available customers for order dropdown
SELECT customerID, CONCAT(firstName, ' ', lastName) as fullName, email
FROM Customers
ORDER BY lastName, firstName;

-- Get all available sales rate locations for order dropdown
SELECT salesRateID, CONCAT(county, ', ', state) as location, taxRate
FROM SalesRateLocations
ORDER BY state, county;

-- Get all available books for book author association dropdown
SELECT bookID, title
FROM Books
ORDER BY title;

-- Get all available authors for book author association dropdown
SELECT authorID, fullName
FROM Authors
ORDER BY fullName;

-- Get all available books for book genre association dropdown
SELECT bookID, title
FROM Books
ORDER BY title;

-- Get all available genres for book genre association dropdown
SELECT genreID, genreName
FROM Genres
ORDER BY genreName;

-- Get all available books for book location association dropdown
SELECT bookID, title
FROM Books
ORDER BY title;

-- Get all available locations for book location association dropdown
SELECT slocID, slocName
FROM SLOCS
ORDER BY slocName;

-- Get all available books for order items association dropdown
SELECT bookID, title, price, inventoryQty
FROM Books
WHERE inventoryQty > 0
ORDER BY title;

-- Get all available customers for order association dropdown
SELECT customerID, CONCAT(firstName, ' ', lastName) as fullName, email
FROM Customers
ORDER BY lastName, firstName;

-- Get all available sales rate locations for order association dropdown
SELECT salesRateID, CONCAT(county, ', ', state) as location, taxRate
FROM SalesRateLocations
ORDER BY state, county;

-- Get all available publishers for book dropdown
SELECT publisherID, publisherName
FROM Publishers
ORDER BY publisherName;

-- Get all available authors for author dropdown (for editing existing associations)
SELECT authorID, fullName
FROM Authors
ORDER BY fullName;

-- Get all available genres for genre dropdown (for editing existing associations)
SELECT genreID, genreName
FROM Genres
ORDER BY genreName;

-- Get all available locations for location dropdown (for editing existing associations)
SELECT slocID, slocName
FROM SLOCS
ORDER BY slocName;

-- Get all available publishers for publisher dropdown (for editing existing associations)
SELECT publisherID, publisherName
FROM Publishers
ORDER BY publisherName;

-- Get all available sales rate locations for sales rate dropdown (for editing existing associations)
SELECT salesRateID, CONCAT(county, ', ', state) as location, taxRate
FROM SalesRateLocations
ORDER BY state, county;



SELECT
    b.title,
    g.genreName
FROM
    Books AS b
JOIN
    BookGenres AS bg ON b.bookID = bg.bookID
JOIN
    Genre AS a ON bg.genreID = g.genreID
ORDER BY
    b.title;

DELETE FROM BookGenres WHERE bookGenreID = :bookGenreID_input;


UPDATE BookAuthors SET genreID = :genreID_input, bookID = :bookID_input WHERE bookGenreID = :bookGenreID_to_update;


SELECT b.title, b.bookID FROM Books b;
Select g.genreName, g.genreID FROM Authors a;


INSERT INTO BookGenres (genreID, bookID) VALUES (:genreID_input, :bookID_input);



SELECT
    b.title,
    a.fullName
FROM
    Books AS b
JOIN
    BookAuthors AS ba ON b.bookID = ba.bookID
JOIN
    Authors AS a ON ba.authorID = a.authorID
ORDER BY
    b.title;

DELETE FROM BookAuthors WHERE bookAuthorID = :bookAuthorID_input;


UPDATE BookAuthors SET authorID = :authorID_input, bookID = :bookID_input WHERE bookAuthorID = :bookAuthorID_to_update;


SELECT b.title, b.bookID FROM Books b;
Select a.fullName, a.authorID FROM Authors a;


INSERT INTO BookAuthors (authorID, bookID) VALUES (:authorID_input, :bookID_input);

SELECT
    s.slocName,
    b.title
FROM
    Books AS b
JOIN
    BookLocations AS bl ON b.bookID = bl.bookID
JOIN
    SLOCS s ON bl.slocID = s.slocID
ORDER BY
    b.title;

DELETE FROM BookLocations WHERE bookLocationID = :bookLocationID_input;


UPDATE BookLocations SET bookID = :bookID_input, slocID = :slocID_input WHERE bookLocationID = :bookLocationID_to_update;


SELECT s.slocName, s.slocID FROM SLOCS s;
Select b.title, b.bookID FROM Books b;


INSERT INTO BookLocations (bookID, slocID) VALUES (:bookID_input, :slocID_input);
