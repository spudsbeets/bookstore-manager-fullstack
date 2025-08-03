-- citation: ChatGPT
-- 08/03/25
-- Asked ChatGPT for assistance in formulating stored procedures for CUD operations. 

-- Insert Book
DELIMITER $$

CREATE PROCEDURE sp_insertBook(
    IN p_title VARCHAR(255),
    IN p_publicationDate DATE,
    IN p_isbn10 CHAR(13),
    IN p_isbn13 CHAR(17),
    IN p_price DECIMAL(10,2),
    IN p_inventoryQty INT,
    IN p_publisherID INT,
    IN p_inStock TINYINT
)
BEGIN
    INSERT INTO Books (
        title,
        publicationDate,
        `isbn-10`,
        `isbn-13`,
        price,
        inventoryQty,
        publisherID,
        inStock
    ) VALUES (
        p_title,
        p_publicationDate,
        p_isbn10,
        p_isbn13,
        p_price,
        p_inventoryQty,
        p_publisherID,
        p_inStock
    );
END $$

DELIMITER ;

-- Update Book
DELIMITER $$

CREATE PROCEDURE sp_updateBook(
    IN p_bookID INT,
    IN p_title VARCHAR(255),
    IN p_publicationDate DATE,
    IN p_price DECIMAL(10,2),
    IN p_inventoryQty INT,
    IN p_publisherID INT
)
BEGIN
    UPDATE Books
    SET 
        title = p_title,
        publicationDate = p_publicationDate,
        price = p_price,
        inventoryQty = p_inventoryQty,
        publisherID = p_publisherID
    WHERE bookID = p_bookID;
END $$

DELIMITER ;

-- Delete a book
DELIMITER $$

CREATE PROCEDURE sp_deleteBook(
    IN p_bookID INT
)
BEGIN
    DELETE FROM Books
    WHERE bookID = p_bookID;
END $$

DELIMITER ;

-- Insert an author
DELIMITER $$

CREATE PROCEDURE sp_insertAuthor(
    IN p_firstName VARCHAR(80),
    IN p_middleName VARCHAR(80),
    IN p_lastName VARCHAR(80)
)
BEGIN
    INSERT INTO Authors (firstName, middleName, lastName)
    VALUES (p_firstName, p_middleName, p_lastName);
END $$

DELIMITER ;

-- Update an Author
DELIMITER $$

CREATE PROCEDURE sp_updateAuthor(
    IN p_authorID INT,
    IN p_firstName VARCHAR(80),
    IN p_middleName VARCHAR(80),
    IN p_lastName VARCHAR(80)
)
BEGIN
    UPDATE Authors
    SET firstName = p_firstName,
        middleName = p_middleName,
        lastName = p_lastName
    WHERE authorID = p_authorID;
END $$

DELIMITER ;

-- Delete an Author
DELIMITER $$

CREATE PROCEDURE sp_deleteAuthor(
    IN p_authorID INT
)
BEGIN
    DELETE FROM Authors
    WHERE authorID = p_authorID;
END $$

DELIMITER ;

-- Add a customer
DELIMITER $$

CREATE PROCEDURE sp_insertCustomer(
    IN p_firstName VARCHAR(100),
    IN p_lastName VARCHAR(100),
    IN p_email VARCHAR(255),
    IN p_phoneNumber CHAR(10)
)
BEGIN
    INSERT INTO Customers (firstName, lastName, email, phoneNumber)
    VALUES (p_firstName, p_lastName, p_email, p_phoneNumber);
END $$

DELIMITER ;

-- Update a customer
DELIMITER $$

CREATE PROCEDURE sp_updateCustomer(
    IN p_customerID INT,
    IN p_firstName VARCHAR(100),
    IN p_lastName VARCHAR(100),
    IN p_email VARCHAR(255),
    IN p_phoneNumber CHAR(10)
)
BEGIN
    UPDATE Customers
    SET firstName = p_firstName,
        lastName = p_lastName,
        email = p_email,
        phoneNumber = p_phoneNumber
    WHERE customerID = p_customerID;
END $$

DELIMITER ;

-- Delete a customer
DELIMITER $$

CREATE PROCEDURE sp_deleteCustomer(
    IN p_customerID INT
)
BEGIN
    DELETE FROM Customers
    WHERE customerID = p_customerID;
END $$

DELIMITER ;

-- Add an order
DELIMITER $$

CREATE PROCEDURE sp_addOrder(
    IN p_orderDate DATE,
    IN p_orderTime TIME,
    IN p_total DECIMAL(10,2),
    IN p_taxRate DECIMAL(6,4),
    IN p_customerID INT,
    IN p_salesRateID INT,
    IN p_bookIDs JSON,
    IN p_quantities JSON,
    IN p_prices JSON,
    IN p_subtotals JSON
)
BEGIN
    DECLARE lastOrderID INT;
    DECLARE i INT DEFAULT 0;
    DECLARE arrLength INT;

    -- 1. Insert the main order record
    INSERT INTO Orders(orderDate, orderTime, total, taxRate, customerID, salesRateID)
    VALUES (p_orderDate, p_orderTime, p_total, p_taxRate, p_customerID, p_salesRateID);

    SET lastOrderID = LAST_INSERT_ID();

    -- Get number of items in the arrays
    SET arrLength = JSON_LENGTH(p_bookIDs);

    -- Loop through each item in cart
    WHILE i < arrLength DO
        INSERT INTO OrderItems(orderID, bookID, quantity, individualPrice, subtotal)
        VALUES (
            lastOrderID,
            JSON_UNQUOTE(JSON_EXTRACT(p_bookIDs, CONCAT('$[', i, ']'))),
            JSON_EXTRACT(p_quantities, CONCAT('$[', i, ']')),
            JSON_EXTRACT(p_prices, CONCAT('$[', i, ']')),
            JSON_EXTRACT(p_subtotals, CONCAT('$[', i, ']'))
        );

        -- Update inventory for each book
        UPDATE Books
        SET inventoryQty = inventoryQty - JSON_EXTRACT(p_quantities, CONCAT('$[', i, ']'))
        WHERE bookID = JSON_UNQUOTE(JSON_EXTRACT(p_bookIDs, CONCAT('$[', i, ']')));

        SET i = i + 1;
    END WHILE;

END $$

DELIMITER ;

-- Delete an order
DELIMITER $$

CREATE PROCEDURE sp_deleteOrder (
    IN p_orderID INT
)
BEGIN
    DELETE FROM Orders WHERE orderID = p_orderID;
END $$

DELIMITER ;

-- Associate author with a book
DELIMITER $$

CREATE PROCEDURE sp_addBookAuthorToBook (
    IN p_bookID INT,
    IN p_authorID INT
)
BEGIN
    INSERT INTO BookAuthors (bookID, authorID)
    VALUES (p_bookID, p_authorID);
END $$

DELIMITER ;

-- Remove author from a book
DELIMITER $$

CREATE PROCEDURE sp_deleteBookAuthorFromBook (
    IN p_bookID INT,
    IN p_authorID INT
)
BEGIN
    DELETE FROM BookAuthors
    WHERE bookID = p_bookID
      AND authorID = p_authorID;
END $$

DELIMITER ;

-- Add a genre
DELIMITER $$

CREATE PROCEDURE sp_insertGenre (
    IN p_genreName VARCHAR(255)
)
BEGIN
    INSERT INTO Genres (genreName)
    VALUES (p_genreName);
END $$

DELIMITER ;

-- Add a genre to a book
DELIMITER $$

CREATE PROCEDURE sp_insertBookGenre (
    IN p_bookID INT,
    IN p_genreID INT
)
BEGIN
    INSERT INTO BookGenres (bookID, genreID)
    VALUES (p_bookID, p_genreID);
END $$

DELIMITER ;

-- Remove a genre from a book
DELIMITER $$

CREATE PROCEDURE sp_deleteBookGenre (
    IN p_bookID INT,
    IN p_genreID INT
)
BEGIN
    DELETE FROM BookGenres
    WHERE bookID = p_bookID AND genreID = p_genreID;
END $$

DELIMITER ;

-- Add a publisher
DELIMITER $$

CREATE PROCEDURE sp_insertPublisher (
    IN p_publisherName VARCHAR(255)
)
BEGIN
    INSERT INTO Publishers (publisherName)
    VALUES (p_publisherName);
END $$

DELIMITER ;

-- Add a SalesTaxLocation
DELIMITER $$

CREATE PROCEDURE sp_insertSalesRateLocation (
    IN p_county VARCHAR(45),
    IN p_state VARCHAR(45),
    IN p_taxRate DECIMAL(6,4)
)
BEGIN
    INSERT INTO SalesRateLocations (county, state, taxRate)
    VALUES (p_county, p_state, p_taxRate);
END $$

DELIMITER ;

-- Add a store location
DELIMITER $$

CREATE PROCEDURE sp_insertSLOC (
    IN p_slocName VARCHAR(45)
)
BEGIN
    INSERT INTO SLOCS (slocName)
    VALUES (p_slocName);
END $$

DELIMITER ;

DELIMITER $$

-- Add a book to a specific store and update quantity
CREATE PROCEDURE sp_insertBookLocation (
    IN p_bookID INT,
    IN p_slocID INT,
    IN p_quantity INT
)
BEGIN
    INSERT INTO BookLocations (bookID, slocID, quantity)
    VALUES (p_bookID, p_slocID, p_quantity);
END $$

DELIMITER ;

-- Update book quantity at a location
DELIMITER $$

CREATE PROCEDURE sp_updateBookLocationQuantity (
    IN p_bookID INT,
    IN p_slocID INT,
    IN p_quantity INT
)
BEGIN
    UPDATE BookLocations
    SET quantity = p_quantity
    WHERE bookID = p_bookID AND slocID = p_slocID;
END $$

DELIMITER ;