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
    DECLARE order_count INT DEFAULT 0;
    DECLARE error_msg VARCHAR(255);
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;
        -- Check if customer has orders
        SELECT COUNT(*) INTO order_count FROM Orders WHERE customerID = p_customerID;
        
        IF order_count > 0 THEN
            SET error_msg = CONCAT('Cannot delete customer. Customer has ', order_count, ' order(s). Delete orders first.');
            SIGNAL SQLSTATE '45000' 
            SET MESSAGE_TEXT = error_msg;
        END IF;
        
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

-- Authors Procedures

-- Dynamic create procedure for Authors table
-- citation prompt ai had an error with handling of the empty strings showing as null on the front end, 
-- ai fixed it by adding the if statements to convert the empty strings to null
-- used auto agent on cursor to fix the error
DROP PROCEDURE IF EXISTS sp_dynamic_create_authors;
DELIMITER $$
CREATE PROCEDURE sp_dynamic_create_authors(
    IN p_data JSON
)
BEGIN
    DECLARE first_name_val VARCHAR(80);
    DECLARE middle_name_val VARCHAR(80);
    DECLARE last_name_val VARCHAR(80);
    DECLARE insert_id INT;
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;
        -- Extract values from JSON
        SET first_name_val = JSON_UNQUOTE(JSON_EXTRACT(p_data, '$.firstName'));
        SET middle_name_val = JSON_UNQUOTE(JSON_EXTRACT(p_data, '$.middleName'));
        SET last_name_val = JSON_UNQUOTE(JSON_EXTRACT(p_data, '$.lastName'));
        
        -- Convert empty strings to NULL for optional fields
        IF middle_name_val = '' OR middle_name_val = 'null' THEN SET middle_name_val = NULL; END IF;
        IF last_name_val = '' OR last_name_val = 'null' THEN SET last_name_val = NULL; END IF;
        
        -- Insert
        INSERT INTO Authors (firstName, middleName, lastName)
        VALUES (first_name_val, middle_name_val, last_name_val);
        
        SET insert_id = LAST_INSERT_ID();
    COMMIT;
    
    -- Return the result as JSON
    SELECT JSON_OBJECT(
        'id', insert_id,
        'firstName', first_name_val,
        'middleName', middle_name_val,
        'lastName', last_name_val
    ) as result;
END $$
DELIMITER ;

-- Dynamic update procedure for Authors table
-- citation prompt ai had an error with handling of the empty strings showing as null on the front end, 
-- ai fixed it by adding the if statements to convert the empty strings to null
-- used auto agent on cursor to fix the error
DROP PROCEDURE IF EXISTS sp_dynamic_update_authors;
DELIMITER $$
CREATE PROCEDURE sp_dynamic_update_authors(
    IN p_id INT,
    IN p_data JSON
)
BEGIN
    DECLARE first_name_val VARCHAR(80);
    DECLARE middle_name_val VARCHAR(80);
    DECLARE last_name_val VARCHAR(80);
    DECLARE affected_rows INT;
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;
        -- Extract values from JSON
        SET first_name_val = JSON_UNQUOTE(JSON_EXTRACT(p_data, '$.firstName'));
        SET middle_name_val = JSON_UNQUOTE(JSON_EXTRACT(p_data, '$.middleName'));
        SET last_name_val = JSON_UNQUOTE(JSON_EXTRACT(p_data, '$.lastName'));
        
        -- Convert empty strings to NULL for optional fields
        IF middle_name_val = '' OR middle_name_val = 'null' THEN SET middle_name_val = NULL; END IF;
        IF last_name_val = '' OR last_name_val = 'null' THEN SET last_name_val = NULL; END IF;
        
        -- Update
        UPDATE Authors
        SET firstName = first_name_val,
            middleName = middle_name_val,
            lastName = last_name_val
        WHERE authorID = p_id;
        
        SET affected_rows = ROW_COUNT();
    COMMIT;
    
    -- Return the result as JSON
    IF affected_rows > 0 THEN
        SELECT JSON_OBJECT(
            'id', p_id,
            'firstName', first_name_val,
            'middleName', middle_name_val,
            'lastName', last_name_val
        ) as result;
    ELSE
        SELECT NULL as result;
    END IF;
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
        -- No need to manually delete from BookAuthors due to ON DELETE CASCADE
        DELETE FROM Authors WHERE authorID = p_authorID;
    COMMIT;
END $$
DELIMITER ;

DELIMITER ;

-- Delete a book author relationship
DROP PROCEDURE IF EXISTS sp_deleteBookAuthor;
DELIMITER $$
CREATE PROCEDURE sp_deleteBookAuthor(
    IN p_bookAuthorID INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;
        DELETE FROM BookAuthors WHERE bookAuthorID = p_bookAuthorID;
    COMMIT;
END $$
DELIMITER ;
-- ===========================================================================
-- Stored Procedure: sp_dynamic_update_book_genres
-- Description: Dynamically updates the BookGenres table using JSON input.
-- ===========================================================================
-- Citation:
-- Date: 2025-08-05
-- Adapted by: Sean Brady
-- Based on original ideas and patterns from:
--   - MySQL documentation on JSON functions: https://dev.mysql.com/doc/refman/8.0/en/json.html
--   - MySQL documentation on stored procedures: https://dev.mysql.com/doc/refman/8.0/en/create-procedure.html
-- AI Tool Use:
--   - Used ChatGPT to review/refactor logic and optimize JSON extraction pattern.
--   - Prompt: "Create a MySQL stored procedure that takes a JSON input and updates a row in a table."
-- ===========================================================================
DROP PROCEDURE IF EXISTS sp_dynamic_update_book_genres;
DELIMITER $$
CREATE PROCEDURE sp_dynamic_update_book_genres(
    IN p_id INT,
    IN p_data JSON
)
BEGIN
    DECLARE genre_id_val INT;
    DECLARE book_id_val INT;
    DECLARE affected_rows INT;
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;
        -- Extract values from JSON
        SET genre_id_val = JSON_EXTRACT(p_data, '$.genreID');
        SET book_id_val = JSON_EXTRACT(p_data, '$.bookID');
        
        -- Update
        UPDATE BookGenres
        SET genreID = genre_id_val,
            bookID = book_id_val
        WHERE bookGenreID = p_id;
        
        SET affected_rows = ROW_COUNT();
    COMMIT;
    
    -- Return the result as JSON
    IF affected_rows > 0 THEN
        SELECT JSON_OBJECT(
            'id', p_id,
            'genreID', genre_id_val,
            'bookID', book_id_val
        ) as result;
    ELSE
        SELECT NULL as result;
    END IF;
END $$
DELIMITER ;



-- =================================================================
-- Views for Book Relationships
-- =================================================================

-- View for book authors with full details
DROP VIEW IF EXISTS v_book_authors;
CREATE VIEW v_book_authors AS
SELECT 
    ba.bookAuthorID,
    ba.bookID,
    ba.authorID,
    b.title,
    a.fullName AS author
FROM BookAuthors ba
INNER JOIN Books b ON ba.bookID = b.bookID
INNER JOIN Authors a ON ba.authorID = a.authorID
ORDER BY b.title, a.fullName;

-- View for book genres with full details
DROP VIEW IF EXISTS v_book_genres;
CREATE VIEW v_book_genres AS
SELECT 
    bg.bookGenreID,
    bg.bookID,
    bg.genreID,
    b.title,
    g.genreName AS genre
FROM BookGenres bg
INNER JOIN Books b ON bg.bookID = b.bookID
INNER JOIN Genres g ON bg.genreID = g.genreID
ORDER BY b.title, g.genreName;

-- View for book locations with full details
DROP VIEW IF EXISTS v_book_locations;
CREATE VIEW v_book_locations AS
SELECT 
    bl.bookLocationID,
    bl.bookID,
    bl.slocID,
    bl.quantity,
    b.title,
    s.slocName
FROM BookLocations bl
INNER JOIN Books b ON bl.bookID = b.bookID
INNER JOIN SLOCS s ON bl.slocID = s.slocID
ORDER BY b.title, s.slocName;


-- Dynamic create procedure for BookAuthors table
DROP PROCEDURE IF EXISTS sp_dynamic_create_book_authors;
DELIMITER $$
CREATE PROCEDURE sp_dynamic_create_book_authors(
    IN p_data JSON
)
BEGIN
    DECLARE author_id_val INT;
    DECLARE book_id_val INT;
    DECLARE insert_id INT;
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;
        -- Extract values from JSON
        SET author_id_val = JSON_EXTRACT(p_data, '$.authorID');
        SET book_id_val = JSON_EXTRACT(p_data, '$.bookID');
        
        -- Insert
        INSERT INTO BookAuthors (authorID, bookID)
        VALUES (author_id_val, book_id_val);
        
        SET insert_id = LAST_INSERT_ID();
    COMMIT;
    
    -- Return the result as JSON
    SELECT JSON_OBJECT(
        'id', insert_id,
        'authorID', author_id_val,
        'bookID', book_id_val
    ) as result;
END $$
DELIMITER ;


DROP PROCEDURE IF EXISTS sp_load_bookdb;
DELIMITER $$
CREATE PROCEDURE sp_load_bookdb()
BEGIN
    SET FOREIGN_KEY_CHECKS=0;


    -- -----------------------------------------------------
    -- Drop and Create Publishers table
    -- -----------------------------------------------------
    DROP TABLE IF EXISTS `Publishers`;
    CREATE TABLE `Publishers` (
    `publisherID` INT NOT NULL AUTO_INCREMENT,
    `publisherName` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`publisherID`))
    ENGINE = InnoDB;


    -- -----------------------------------------------------
    -- Drop and Create Books table
    -- -----------------------------------------------------
    DROP TABLE IF EXISTS `Books`;
    CREATE TABLE `Books` (
    `bookID` INT NOT NULL AUTO_INCREMENT,
    `publicationDate` DATE NOT NULL,
    `isbn-10` CHAR(13) NULL,
    `isbn-13` CHAR(17) NULL,
    `inStock` TINYINT NOT NULL DEFAULT 0,
    `price` DECIMAL(10,2) NOT NULL,
    `inventoryQty` INT NOT NULL DEFAULT 0,
    `title` VARCHAR(255) NOT NULL,
    `publisherID` INT NULL,

    PRIMARY KEY (`bookID`),
    UNIQUE INDEX `isbn-10_UNIQUE` (`isbn-10` ASC) VISIBLE,
    UNIQUE INDEX `isbn-13_UNIQUE` (`isbn-13` ASC) VISIBLE,
    INDEX `fk_Books_Publishers1_idx` (`publisherID` ASC) VISIBLE,

    CONSTRAINT `fk_Books_Publishers1`
        FOREIGN KEY (`publisherID`)
        REFERENCES `Publishers` (`publisherID`)
        ON DELETE SET NULL
        ON UPDATE CASCADE)
    ENGINE = InnoDB;


    -- -----------------------------------------------------
    -- Drop and Create Customers table
    -- -----------------------------------------------------
    DROP TABLE IF EXISTS `Customers`;
    CREATE TABLE `Customers` (
    `customerID` INT NOT NULL AUTO_INCREMENT,
    `firstName` VARCHAR(100) NOT NULL,
    `lastName` VARCHAR(100) NOT NULL,
    `email` VARCHAR(255) NULL,
    `phoneNumber` CHAR(10) NULL,
    PRIMARY KEY (`customerID`),
    UNIQUE INDEX `phoneNumber_UNIQUE` (`phoneNumber` ASC) VISIBLE,
    UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE
    )
    ENGINE = InnoDB;


    -- -----------------------------------------------------
    -- Drop and Create SalesRateLocations table
    -- -----------------------------------------------------
    DROP TABLE IF EXISTS `SalesRateLocations`;
    CREATE TABLE `SalesRateLocations` (
    `salesRateID` INT NOT NULL AUTO_INCREMENT,
    `taxRate` decimal(6,4) NOT NULL,
    `county` varchar(45) NOT NULL,
    `state` varchar(45) NOT NULL,
    PRIMARY KEY (`salesRateID`)
    )
    ENGINE = InnoDB;


    -- -----------------------------------------------------
    -- Drop and Create Orders table
    -- -----------------------------------------------------
    DROP TABLE IF EXISTS `Orders`;
    CREATE TABLE `Orders` (
    `orderID` INT NOT NULL AUTO_INCREMENT,
    `orderDate` DATE NOT NULL DEFAULT (CURDATE()),
    `orderTime` TIME NOT NULL DEFAULT (CURTIME()),
    `total` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    `taxRate` DECIMAL(6,4) NOT NULL,
    `customerID` INT NOT NULL,
    `salesRateID` INT NOT NULL,
    PRIMARY KEY (`orderID`),
    INDEX `fk_Orders_Customers1_idx` (`customerID` ASC) VISIBLE,
    INDEX `fk_Orders_SalesRates1_idx` (`salesRateID` ASC) VISIBLE,
    CONSTRAINT `fk_Orders_Customers1`
        FOREIGN KEY (`customerID`)
        REFERENCES `Customers` (`customerID`)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT `fk_Orders_SalesRates1`
        FOREIGN KEY (`salesRateID`)
        REFERENCES `SalesRateLocations` (`salesRateID`)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
    )
    ENGINE = InnoDB;


    -- -----------------------------------------------------
    -- Drop and Create OrderItems table
    -- -----------------------------------------------------
    DROP TABLE IF EXISTS `OrderItems`;
    CREATE TABLE `OrderItems` (
    `orderItemID` INT NOT NULL AUTO_INCREMENT,
    `orderID` INT NOT NULL,
    `bookID` INT NOT NULL,
    `quantity` INT NOT NULL,
    `individualPrice` DECIMAL(10,2) NOT NULL,
    `subtotal` DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (`orderItemID`),
    INDEX `fk_OrderItems_Books1_idx` (`bookID` ASC) VISIBLE,
    INDEX `fk_OrderItems_Orders1_idx` (`orderID` ASC) VISIBLE,
    CONSTRAINT `fk_OrderItems_Books1`
        FOREIGN KEY (`bookID`)
        REFERENCES `Books` (`bookID`)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT `fk_OrderItems_Orders1`
        FOREIGN KEY (`orderID`)
        REFERENCES `Orders` (`orderID`)
        ON DELETE CASCADE
        ON UPDATE CASCADE)
    ENGINE = InnoDB;


    -- -----------------------------------------------------
    -- Create Genres table
    -- -----------------------------------------------------
    DROP TABLE IF EXISTS `Genres`;
    CREATE TABLE `Genres` (
    `genreID` INT NOT NULL AUTO_INCREMENT,
    `genreName` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`genreID`),
    UNIQUE INDEX `genreName_UNIQUE` (`genreName` ASC) VISIBLE)
    ENGINE = InnoDB;


    -- -----------------------------------------------------
    -- Create Authors table
    -- -----------------------------------------------------
    DROP TABLE IF EXISTS `Authors`;
    CREATE TABLE `Authors` (
    `authorID` INT NOT NULL AUTO_INCREMENT,
    `firstName` VARCHAR(80) NOT NULL,
    `middleName` VARCHAR(80) NULL,
    `lastName` VARCHAR(80) NULL,
    `fullName` VARCHAR(243) GENERATED ALWAYS AS (CONCAT_WS(' ',firstName,middleName, lastName)) STORED,
    PRIMARY KEY (`authorID`),
    UNIQUE INDEX `fullName_UNIQUE` (`fullName` ASC) VISIBLE)
    ENGINE = InnoDB;


    -- -----------------------------------------------------
    -- Create SLOCS table
    -- -----------------------------------------------------
    DROP TABLE IF EXISTS `SLOCS`;
    CREATE TABLE `SLOCS` (
    `slocID` INT NOT NULL AUTO_INCREMENT,
    `slocName` VARCHAR(45) NOT NULL,
    PRIMARY KEY (`slocID`),
    UNIQUE INDEX `slocName_UNIQUE` (`slocName` ASC) VISIBLE)
    ENGINE = InnoDB;


    -- -----------------------------------------------------
    -- Create BookLocations table
    -- -----------------------------------------------------
    DROP TABLE IF EXISTS `BookLocations`;
    CREATE TABLE `BookLocations` (
    `bookLocationID` INT NOT NULL AUTO_INCREMENT,
    `bookID` INT NOT NULL,
    `slocID` INT NOT NULL,
    `quantity` INT NOT NULL,
    PRIMARY KEY (`bookLocationID`),
    UNIQUE INDEX `unique_book_location` (`bookID`, `slocID`),
    INDEX `fk_BookLocations_Books1_idx` (`bookID` ASC) VISIBLE,
    INDEX `fk_BookLocations_SLOCS1_idx` (`slocID` ASC) VISIBLE,
    CONSTRAINT `fk_BookLocations_Books1`
        FOREIGN KEY (`bookID`)
        REFERENCES `Books` (`bookID`)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT `fk_BookLocations_SLOCS1`
        FOREIGN KEY (`slocID`)
        REFERENCES `SLOCS` (`slocID`)
        ON DELETE CASCADE
        ON UPDATE CASCADE)
    ENGINE = InnoDB;


    -- -----------------------------------------------------
    -- Create BookAuthors table
    -- -----------------------------------------------------
    DROP TABLE IF EXISTS `BookAuthors`;
    CREATE TABLE `BookAuthors` (
    `bookAuthorID` INT NOT NULL AUTO_INCREMENT,
    `authorID` INT NOT NULL,
    `bookID` INT NOT NULL,
    PRIMARY KEY (`bookAuthorID`),
    UNIQUE INDEX `unique_book_author` (`bookID`, `authorID`),
    INDEX `fk_BookAuthors_Authors1_idx` (`authorID` ASC) VISIBLE,
    INDEX `fk_BookAuthors_Books1_idx` (`bookID` ASC) VISIBLE,
    CONSTRAINT `fk_BookAuthors_Authors1`
        FOREIGN KEY (`authorID`)
        REFERENCES `Authors` (`authorID`)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT `fk_BookAuthors_Books1`
        FOREIGN KEY (`bookID`)
        REFERENCES `Books` (`bookID`)
        ON DELETE CASCADE
        ON UPDATE CASCADE)
    ENGINE = InnoDB;


    -- -----------------------------------------------------
    -- Create BookGenres table
    -- -----------------------------------------------------
    DROP TABLE IF EXISTS `BookGenres`;
    CREATE TABLE `BookGenres` (
    `bookGenreID` INT NOT NULL AUTO_INCREMENT,
    `bookID` INT NOT NULL,
    `genreID` INT NOT NULL,
    PRIMARY KEY (`bookGenreID`),
    UNIQUE INDEX `unique_book_genre` (`bookID`, `genreID`),
    INDEX `fk_BookGenres_Books1_idx` (`bookID` ASC) VISIBLE,
    INDEX `fk_BookGenres_Genres1_idx` (`genreID` ASC) VISIBLE,
    CONSTRAINT `fk_BookGenres_Books1`
        FOREIGN KEY (`bookID`)
        REFERENCES `Books` (`bookID`)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT `fk_BookGenres_Genres1`
        FOREIGN KEY (`genreID`)
        REFERENCES `Genres` (`genreID`)
        ON DELETE CASCADE
        ON UPDATE CASCADE)
    ENGINE = InnoDB;

    -- ----------------------------
    -- Inserting sample data
    -- ----------------------------
    -- Customers inserts
    INSERT INTO Customers(
        firstName,
        lastName,
        email,
        phoneNumber)
    VALUES ('Reggie','Reggerson', 'regreg@reg.com', '3333888902'),
        ('Gail', 'Nightingstocks', 'gailsmail@gmail.com', '2295730384'),
        ('Filipe', 'Redsky', 'filipe@hotmail.com', '5649836590');

    -- Authors inserts
    INSERT INTO Authors(
        firstName,
        middleName,
        lastName
        )
    VALUES ('Toni', NULL, 'Morrison'),
        ('Thomas', NULL, 'Pynchon'),
        ('Stephen', 'Edwin', 'King'),
        ('Peter',NULL,'Straub'),
        ('Neil','Richard','Gaiman'),
        ('Terry',NULL, 'Pratchett');

    -- Genres inserts
    INSERT INTO Genres(
        genreName
        )
    VALUES ('Postmodern Fiction'),
    ('Historical Fiction'),
    ('Horror Fiction'),
    ('Science Fiction'),
    ('Fantasy Fiction');

    -- Publishers inserts
    INSERT INTO Publishers(
        publisherName
        )
    VALUES ('Vintage International'), ('Penguin Books'), ('Viking Press'), ('William Morrow');

    -- SalesRateLocations inserts
    INSERT INTO SalesRateLocations(
    taxRate,
    county,
    state
    )
    VALUES  (0.042, 'Polk', 'Iowa'),
            (0.051, 'Jerome', 'Idaho'),
            (0.08625, 'San Francisco', 'California');

    -- SLOCS inserts
    INSERT INTO SLOCS(
        slocName
        )
    VALUES ('Orchard'), ('Sunwillow'), ('Whiskey Pines');

    -- Books inserts
    INSERT INTO Books(
        publicationDate,
        `isbn-10`,
        `isbn-13`,
        inStock,
        price,
        inventoryQty,
        title,
        publisherID
        )
    SELECT '2009-08-04', '0143126850', '9780143126850', 1, 15.99, 5, 'Inherent Vice', publisherID FROM Publishers WHERE publisherName = 'Penguin Books';
    INSERT INTO Books(
        publicationDate,
        `isbn-10`,
        `isbn-13`,
        inStock,
        price,
        inventoryQty,
        title,
        publisherID
        )
    SELECT '1987-09-01', '1400033416', '9781400033416', 1, 17.99, 7, 'Beloved', publisherID FROM Publishers WHERE publisherName = 'Vintage International';
    INSERT INTO Books (
        publicationDate,
        `isbn-10`,
        `isbn-13`,
        inStock,
        price,
        inventoryQty,
        title,
        publisherID
    )
    SELECT '1984-11-08', '0670691992', '9780670691999', 1, 18.99, 6, 'The Talisman', publisherID
    FROM Publishers
    WHERE publisherName = 'Viking Press';
    INSERT INTO Books (
        publicationDate,
        `isbn-10`,
        `isbn-13`,
        inStock,
        price,
        inventoryQty,
        title,
        publisherID
    )
    SELECT '2006-11-28', '0060853980', '9780060853983', 1, 16.99, 8, 'Good Omens', publisherID
    FROM Publishers
    WHERE publisherName = 'William Morrow';

    -- Orders inserts
    INSERT INTO Orders(
    orderDate,
    orderTime,
    total,
    taxRate,
    customerID,
    salesRateID
    )
    SELECT '2025-10-01', '21:12:11', 45.61, srl.taxRate, c.customerID, srl.salesRateID
    FROM Customers c, SalesRateLocations srl
    WHERE c.firstName = 'Reggie' AND c.lastName = 'Reggerson'
    AND srl.county = 'Polk' AND srl.state = 'Iowa';

    INSERT INTO Orders(
        orderDate,
        orderTime,
        total,
        taxRate,
        customerID,
        salesRateID
        )
    SELECT '2025-10-01', '21:12:11', 61.21, srl.taxRate, c.customerID, srl.salesRateID
    FROM Customers c, SalesRateLocations srl
    WHERE c.firstName = 'Gail' AND c.lastName = 'Nightingstocks'
    AND srl.county = 'Jerome' AND srl.state = 'Idaho';

    INSERT INTO Orders(
        orderDate,
        orderTime,
        total,
        taxRate,
        customerID,
        salesRateID
        )
    SELECT '2025-12-09', '08:24:24', 112.09, srl.taxRate, c.customerID, srl.salesRateID
    FROM Customers c, SalesRateLocations srl
    WHERE c.firstName = 'Filipe' AND c.lastName = 'Redsky'
    AND srl.county = 'San Francisco' AND srl.state = 'California';

    -- OrderItems inserts
    INSERT INTO OrderItems(
        orderID,
        bookID,
        quantity,
        individualPrice,
        subtotal
        )
    SELECT Orders.orderID, Books.bookID, 2, Books.price, 2 * Books.price
    FROM Orders
    JOIN Customers ON Orders.customerID = Customers.customerID
    JOIN Books ON Books.title = 'Beloved'
    WHERE Customers.firstName = 'Reggie';

    INSERT INTO OrderItems(
        orderID,
        bookID,
        quantity,
        individualPrice,
        subtotal
        )
    SELECT Orders.orderID, Books.bookID, 1, Books.price, 1 * Books.price
    FROM Orders
    JOIN Customers ON Orders.customerID = Customers.customerID
    JOIN Books ON Books.title = 'Inherent Vice'
    WHERE Customers.firstName = 'Gail';

    INSERT INTO OrderItems(
        orderID,
        bookID,
        quantity,
        individualPrice,
        subtotal
        )
    SELECT Orders.orderID, Books.bookID, 3, Books.price, 3 * Books.price
    FROM Orders
    JOIN Customers ON Orders.customerID = Customers.customerID
    JOIN Books ON Books.title = 'Good Omens'
    WHERE Customers.firstName = 'Filipe';

    -- BookLocations inserts
    INSERT INTO BookLocations(
        bookID,
        slocID,
        quantity
        )
    SELECT Books.bookID, SLOCS.slocID, 8
    FROM Books
    JOIN SLOCS ON SLOCS.slocName = 'Orchard'
    WHERE Books.title = 'Beloved';

    INSERT INTO BookLocations(
        bookID,
        slocID,
        quantity
        )
    SELECT Books.bookID, SLOCS.slocID, 12
    FROM Books
    JOIN SLOCS ON SLOCS.slocName = 'Sunwillow'
    WHERE Books.title = 'Inherent Vice';

    INSERT INTO BookLocations(
        bookID,
        slocID,
        quantity
        )
    SELECT Books.bookID, SLOCS.slocID, 3
    FROM Books
    JOIN SLOCS ON SLOCS.slocName = 'Whiskey Pines'
    WHERE Books.title = 'Good Omens';

    -- BookAuthors inserts
    INSERT INTO BookAuthors(
        authorID,
        bookID
        )
    SELECT Authors.authorID, Books.bookID
    FROM Authors
    JOIN Books ON Books.title = 'Beloved'
    WHERE Authors.firstName = 'Toni' AND Authors.lastName = 'Morrison';

    INSERT INTO BookAuthors(
        authorID,
        bookID
        )
    SELECT Authors.authorID, Books.bookID
    FROM Authors
    JOIN Books ON Books.title = 'Inherent Vice'
    WHERE Authors.firstName = 'Thomas' AND Authors.lastName = 'Pynchon';

    INSERT INTO BookAuthors(
        authorID,
        bookID
        )
    SELECT Authors.authorID, Books.bookID
    FROM Authors
    JOIN Books ON Books.title = 'Good Omens'
    WHERE Authors.firstName = 'Neil' AND Authors.lastName = 'Gaiman';

     INSERT INTO BookAuthors(
      authorID,
      bookID
      )
    SELECT Authors.authorID, Books.bookID
    FROM Authors
    JOIN Books ON Books.title = 'The Talisman'
    WHERE Authors.firstName = 'Stephen' AND Authors.lastName = 'King';

    INSERT INTO BookAuthors(
        authorID,
        bookID
        )
    SELECT Authors.authorID, Books.bookID
    FROM Authors
    JOIN Books ON Books.title = 'The Talisman'
    WHERE Authors.firstName = 'Peter' AND Authors.lastName = 'Straub';

    -- BookGenres inserts
    INSERT INTO BookGenres(
        genreID,
        bookID
        )
    SELECT Genres.genreID, Books.bookID
    FROM Genres
    JOIN Books ON Books.title = 'Beloved'
    WHERE Genres.genreName = 'Historical Fiction';

    INSERT INTO BookGenres(
        genreID,
        bookID
        )
    SELECT Genres.genreID, Books.bookID
    FROM Genres
    JOIN Books ON Books.title = 'Inherent Vice'
    WHERE Genres.genreName = 'Postmodern Fiction';

    INSERT INTO BookGenres(
        genreID,
        bookID
        )
    SELECT Genres.genreID, Books.bookID
    FROM Genres
    JOIN Books ON Books.title = 'Good Omens'
    WHERE Genres.genreName = 'Science Fiction';
    
    INSERT INTO BookGenres(
      genreID,
      bookID
      )
    SELECT Genres.genreID, Books.bookID
    FROM Genres
    JOIN Books ON Books.title = 'The Talisman'
    WHERE Genres.genreName = 'Fantasy Fiction';

    INSERT INTO BookGenres(
    genreID,
    bookID
    )
    SELECT Genres.genreID, Books.bookID
    FROM Genres
    JOIN Books ON Books.title = 'The Talisman'
    WHERE Genres.genreName = 'Horror Fiction';

    SET FOREIGN_KEY_CHECKS=1;


END $$
DELIMITER ;

-- =================================================================
-- Inventory Management Triggers
-- =================================================================
-- These triggers automatically keep Books.inventoryQty in sync with BookLocations quantities
-- 
-- CITATION: Based on user request to "have the inventory quantity for a book be a trigger and 
-- to remove the option from the form but pull the value based on the quantity in the slsocs"
-- 
-- ADDITIONAL USER REQUESTS AND REFINEMENTS:
-- - User: "we need to update the reset" - Implemented backend reset route that automatically creates triggers
-- - User: "ok the trigger works when reloading the page for the book, but we should update the frontend to where i dont have to refresh the page after deleting or adding a book location"
-- - Frontend: Added automatic book data refresh after BookLocations CRUD operations
-- - Backend: Enhanced reset endpoint to recreate triggers after sp_load_bookdb() execution
-- 
-- REFINEMENTS FOR MARIADB:
-- - Added explicit variable declaration for error_msg VARCHAR(255) before using CONCAT
-- - Used proper MariaDB syntax for SIGNAL statements
-- - Ensured all triggers use consistent DELIMITER handling
-- - Added proper error handling and transaction management
-- - Resolved MariaDB DDL restrictions by implementing triggers directly in reset route

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS after_booklocation_insert;
DROP TRIGGER IF EXISTS after_booklocation_update;
DROP TRIGGER IF EXISTS after_booklocation_delete;

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS CalculateBookInventory;

-- Create the function to calculate inventory
DELIMITER $$

CREATE FUNCTION CalculateBookInventory(book_id INT) 
RETURNS INT
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE total_qty INT DEFAULT 0;
    
    SELECT COALESCE(SUM(quantity), 0) INTO total_qty
    FROM BookLocations 
    WHERE bookID = book_id;
    
    RETURN total_qty;
END$$

-- Create the triggers
CREATE TRIGGER after_booklocation_insert
AFTER INSERT ON BookLocations
FOR EACH ROW
BEGIN
    UPDATE Books 
    SET inventoryQty = CalculateBookInventory(NEW.bookID)
    WHERE bookID = NEW.bookID;
END$$

CREATE TRIGGER after_booklocation_update
AFTER UPDATE ON BookLocations
FOR EACH ROW
BEGIN
    UPDATE Books 
    SET inventoryQty = CalculateBookInventory(NEW.bookID)
    WHERE bookID = NEW.bookID;
END$$

CREATE TRIGGER after_booklocation_delete
AFTER DELETE ON BookLocations
FOR EACH ROW
BEGIN
    UPDATE Books 
    SET inventoryQty = CalculateBookInventory(OLD.bookID)
    WHERE bookID = OLD.bookID;
END$$

DELIMITER ;

