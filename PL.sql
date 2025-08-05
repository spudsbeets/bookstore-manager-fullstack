-- citation: ChatGPT
-- 08/03/25
-- Asked ChatGPT for assistance in formulating stored procedures for CUD operations. 

-- =================================================================
-- Books
-- =================================================================

-- Insert Book
DROP PROCEDURE IF EXISTS sp_insertBook;
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
    -- Exit handler for any SQL exception
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK; -- Roll back the transaction on error
        RESIGNAL; -- Re-throw the error
    END;

    START TRANSACTION;
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
    COMMIT;
END $$
DELIMITER ;

-- Update Book
DROP PROCEDURE IF EXISTS sp_updateBook;
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
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;
        UPDATE Books
        SET
            title = p_title,
            publicationDate = p_publicationDate,
            price = p_price,
            inventoryQty = p_inventoryQty,
            publisherID = p_publisherID
        WHERE bookID = p_bookID;
    COMMIT;
END $$
DELIMITER ;

-- Delete a book
DROP PROCEDURE IF EXISTS sp_deleteBook;
DELIMITER $$
CREATE PROCEDURE sp_deleteBook(
    IN p_bookID INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;
        DELETE FROM Books
        WHERE bookID = p_bookID;
    COMMIT;
END $$
DELIMITER ;


-- =================================================================
-- Authors
-- =================================================================

-- Insert an author
DROP PROCEDURE IF EXISTS sp_insertAuthor;
DELIMITER $$
CREATE PROCEDURE sp_insertAuthor(
    IN p_firstName VARCHAR(80),
    IN p_middleName VARCHAR(80),
    IN p_lastName VARCHAR(80)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;
        INSERT INTO Authors (firstName, middleName, lastName)
        VALUES (p_firstName, p_middleName, p_lastName);
    COMMIT;
END $$
DELIMITER ;

-- Update an Author
DROP PROCEDURE IF EXISTS sp_updateAuthor;
DELIMITER $$
CREATE PROCEDURE sp_updateAuthor(
    IN p_authorID INT,
    IN p_firstName VARCHAR(80),
    IN p_middleName VARCHAR(80),
    IN p_lastName VARCHAR(80)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;
        UPDATE Authors
        SET firstName = p_firstName,
            middleName = p_middleName,
            lastName = p_lastName
        WHERE authorID = p_authorID;
    COMMIT;
END $$
DELIMITER ;

-- Delete an Author
DROP PROCEDURE IF EXISTS sp_deleteAuthor;
DELIMITER $$
CREATE PROCEDURE sp_deleteAuthor(
    IN p_authorID INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;
        -- First, remove associations in BookAuthors to maintain referential integrity
        DELETE FROM BookAuthors WHERE authorID = p_authorID;
        -- Then, delete the author
        DELETE FROM Authors WHERE authorID = p_authorID;
    COMMIT;
END $$
DELIMITER ;


-- =================================================================
-- Customers
-- =================================================================

-- Add a customer
DROP PROCEDURE IF EXISTS sp_insertCustomer;
DELIMITER $$
CREATE PROCEDURE sp_insertCustomer(
    IN p_firstName VARCHAR(100),
    IN p_lastName VARCHAR(100),
    IN p_email VARCHAR(255),
    IN p_phoneNumber CHAR(10)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;
        INSERT INTO Customers (firstName, lastName, email, phoneNumber)
        VALUES (p_firstName, p_lastName, p_email, p_phoneNumber);
    COMMIT;
END $$
DELIMITER ;

-- Update a customer
DROP PROCEDURE IF EXISTS sp_updateCustomer;
DELIMITER $$
CREATE PROCEDURE sp_updateCustomer(
    IN p_customerID INT,
    IN p_firstName VARCHAR(100),
    IN p_lastName VARCHAR(100),
    IN p_email VARCHAR(255),
    IN p_phoneNumber CHAR(10)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;
        UPDATE Customers
        SET firstName = p_firstName,
            lastName = p_lastName,
            email = p_email,
            phoneNumber = p_phoneNumber
        WHERE customerID = p_customerID;
    COMMIT;
END $$
DELIMITER ;

-- Delete a customer
DROP PROCEDURE IF EXISTS sp_deleteCustomer;
DELIMITER $$
CREATE PROCEDURE sp_deleteCustomer(
    IN p_customerID INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;
        DELETE FROM Customers
        WHERE customerID = p_customerID;
    COMMIT;
END $$
DELIMITER ;


-- =================================================================
-- Orders
-- =================================================================

-- Add an order
DROP PROCEDURE IF EXISTS sp_addOrder;
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
    DECLARE current_book_id INT;
    DECLARE current_quantity INT;

    -- Exit handler for any SQL exception
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK; -- Roll back the transaction on error
        RESIGNAL; -- Re-throw the error
    END;

    START TRANSACTION;

    -- 1. Insert the main order record
    INSERT INTO Orders(orderDate, orderTime, total, taxRate, customerID, salesRateID)
    VALUES (p_orderDate, p_orderTime, p_total, p_taxRate, p_customerID, p_salesRateID);

    SET lastOrderID = LAST_INSERT_ID();

    -- Get number of items in the arrays
    SET arrLength = JSON_LENGTH(p_bookIDs);

    -- Loop through each item in cart
    WHILE i < arrLength DO
        SET current_book_id = JSON_UNQUOTE(JSON_EXTRACT(p_bookIDs, CONCAT('$[', i, ']')));
        SET current_quantity = JSON_EXTRACT(p_quantities, CONCAT('$[', i, ']'));
    
        INSERT INTO OrderItems(orderID, bookID, quantity, individualPrice, subtotal)
        VALUES (
            lastOrderID,
            current_book_id,
            current_quantity,
            JSON_EXTRACT(p_prices, CONCAT('$[', i, ']')),
            JSON_EXTRACT(p_subtotals, CONCAT('$[', i, ']'))
        );

        -- Update inventory for each book
        UPDATE Books
        SET inventoryQty = inventoryQty - current_quantity
        WHERE bookID = current_book_id;

        SET i = i + 1;
    END WHILE;

    COMMIT;
END $$
DELIMITER ;

-- Delete an order
DROP PROCEDURE IF EXISTS sp_deleteOrder;
DELIMITER $$
CREATE PROCEDURE sp_deleteOrder (
    IN p_orderID INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;
        -- It's good practice to delete child records first
        DELETE FROM OrderItems WHERE orderID = p_orderID;
        DELETE FROM Orders WHERE orderID = p_orderID;
    COMMIT;
END $$
DELIMITER ;


-- =================================================================
-- Junction Tables (BookAuthors, BookGenres)
-- =================================================================

-- Associate author with a book
DROP PROCEDURE IF EXISTS sp_addBookAuthorToBook;
DELIMITER $$
CREATE PROCEDURE sp_addBookAuthorToBook (
    IN p_bookID INT,
    IN p_authorID INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;
        INSERT INTO BookAuthors (bookID, authorID)
        VALUES (p_bookID, p_authorID);
    COMMIT;
END $$
DELIMITER ;

-- Remove author from a book
DROP PROCEDURE IF EXISTS sp_deleteBookAuthorFromBook;
DELIMITER $$
CREATE PROCEDURE sp_deleteBookAuthorFromBook (
    IN p_bookID INT,
    IN p_authorID INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;
        DELETE FROM BookAuthors
        WHERE bookID = p_bookID
          AND authorID = p_authorID;
    COMMIT;
END $$
DELIMITER ;

-- Add a genre to a book
DROP PROCEDURE IF EXISTS sp_insertBookGenre;
DELIMITER $$
CREATE PROCEDURE sp_insertBookGenre (
    IN p_bookID INT,
    IN p_genreID INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;
        INSERT INTO BookGenres (bookID, genreID)
        VALUES (p_bookID, p_genreID);
    COMMIT;
END $$
DELIMITER ;

-- Remove a genre from a book
DROP PROCEDURE IF EXISTS sp_deleteBookGenre;
DELIMITER $$
CREATE PROCEDURE sp_deleteBookGenre (
    IN p_bookID INT,
    IN p_genreID INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;
        DELETE FROM BookGenres
        WHERE bookID = p_bookID AND genreID = p_genreID;
    COMMIT;
END $$
DELIMITER ;


-- =================================================================
-- Other Look-up Tables (Genres, Publishers, etc.)
-- =================================================================

-- Add a genre
DROP PROCEDURE IF EXISTS sp_insertGenre;
DELIMITER $$
CREATE PROCEDURE sp_insertGenre (
    IN p_genreName VARCHAR(255)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;
        INSERT INTO Genres (genreName)
        VALUES (p_genreName);
    COMMIT;
END $$
DELIMITER ;

-- Add a publisher
DROP PROCEDURE IF EXISTS sp_insertPublisher;
DELIMITER $$
CREATE PROCEDURE sp_insertPublisher (
    IN p_publisherName VARCHAR(255)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;
        INSERT INTO Publishers (publisherName)
        VALUES (p_publisherName);
    COMMIT;
END $$
DELIMITER ;

-- Add a SalesTaxLocation
DROP PROCEDURE IF EXISTS sp_insertSalesRateLocation;
DELIMITER $$
CREATE PROCEDURE sp_insertSalesRateLocation (
    IN p_county VARCHAR(45),
    IN p_state VARCHAR(45),
    IN p_taxRate DECIMAL(6,4)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;
        INSERT INTO SalesRateLocations (county, state, taxRate)
        VALUES (p_county, p_state, p_taxRate);
    COMMIT;
END $$
DELIMITER ;

-- Add a store location
DROP PROCEDURE IF EXISTS sp_insertSLOC;
DELIMITER $$
CREATE PROCEDURE sp_insertSLOC (
    IN p_slocName VARCHAR(45)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;
        INSERT INTO SLOCS (slocName)
        VALUES (p_slocName);
    COMMIT;
END $$
DELIMITER ;


-- =================================================================
-- Book Locations
-- =================================================================

-- Add a book to a specific store and update quantity
DROP PROCEDURE IF EXISTS sp_insertBookLocation;
DELIMITER $$
CREATE PROCEDURE sp_insertBookLocation (
    IN p_bookID INT,
    IN p_slocID INT,
    IN p_quantity INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;
        INSERT INTO BookLocations (bookID, slocID, quantity)
        VALUES (p_bookID, p_slocID, p_quantity);
    COMMIT;
END $$
DELIMITER ;

-- Update book quantity at a location
DROP PROCEDURE IF EXISTS sp_updateBookLocationQuantity;
DELIMITER $$
CREATE PROCEDURE sp_updateBookLocationQuantity (
    IN p_bookID INT,
    IN p_slocID INT,
    IN p_quantity INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;
        UPDATE BookLocations
        SET quantity = p_quantity
        WHERE bookID = p_bookID AND slocID = p_slocID;
    COMMIT;
END $$
DELIMITER ;

-- =================================================================
-- Certificate Count Update
-- =================================================================
DROP PROCEDURE IF EXISTS sp_update_cert_count_totals;
DELIMITER $$
CREATE PROCEDURE sp_update_cert_count_totals()
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;
        UPDATE `bsg_cert` bc
        LEFT JOIN (
            SELECT cid, COUNT(*) AS cCount
            FROM bsg_cert_people bcp
            GROUP BY cid
        ) c ON bc.id = c.cid
        -- Update the cert_total column with the count of people holding each certificate
        SET bc.cert_total = IFNULL(c.cCount, 0);
    COMMIT;
END $$
DELIMITER ;
