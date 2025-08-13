-- Active: 1754121526056@@classmysql.engr.oregonstate.edu@3306@cs340_bradsean
-- citation: ChatGPT
-- 08/03/25
-- Asked ChatGPT for assistance in formulating stored procedures for CUD operations. 

-- =================================================================
-- Books
-- =================================================================

 -- (Removed legacy sp_insertBook/sp_updateBook/sp_deleteBook - unused by backend models)


-- =================================================================
-- Authors
-- =================================================================

 -- (Removed legacy sp_insertAuthor/sp_updateAuthor; keeping single sp_deleteAuthor defined later)


-- =================================================================
-- Customers
-- =================================================================

 -- (Removed legacy sp_insertCustomer/sp_updateCustomer - unused by backend models)

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

 -- (Removed legacy sp_addOrder - unused by backend models)

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

 -- (Removed legacy BookAuthors helpers - backend uses dynamic procedures)

 -- (Removed legacy BookGenres helpers; keep ID-based delete defined later)


-- =================================================================
-- Other Look-up Tables (Genres, Publishers, etc.)
-- =================================================================

 -- (Removed legacy insert helpers for Genres/Publishers/SalesRateLocations/SLOCS)


-- =================================================================
-- Book Locations
-- =================================================================

 -- (Removed legacy BookLocations helpers - backend uses dynamic procedures)

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

 -- Views for books with publisher and inventory info (used by BooksModel.js)
 DROP VIEW IF EXISTS v_book_with_publisher;
 CREATE VIEW v_book_with_publisher AS
 SELECT 
   b.*, p.publisherName
 FROM Books b
 LEFT JOIN Publishers p ON b.publisherID = p.publisherID;

 DROP VIEW IF EXISTS v_books_with_publisher;
 CREATE VIEW v_books_with_publisher AS
 SELECT 
   b.*, p.publisherName
 FROM Books b
 LEFT JOIN Publishers p ON b.publisherID = p.publisherID;

 DROP VIEW IF EXISTS v_books;
 CREATE VIEW v_books AS
 SELECT 
   b.*, p.publisherName
 FROM Books b
 LEFT JOIN Publishers p ON b.publisherID = p.publisherID;

 DROP VIEW IF EXISTS v_books_in_stock;
 CREATE VIEW v_books_in_stock AS
 SELECT 
   b.*, p.publisherName
 FROM Books b
 LEFT JOIN Publishers p ON b.publisherID = p.publisherID
 WHERE b.inStock = 1 AND b.inventoryQty > 0;


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

-- Dynamic update procedure for BookAuthors table
DROP PROCEDURE IF EXISTS sp_dynamic_update_book_authors;
DELIMITER $$
CREATE PROCEDURE sp_dynamic_update_book_authors(
    IN p_id INT,
    IN p_data JSON
)
BEGIN
    DECLARE author_id_val INT;
    DECLARE book_id_val INT;
    DECLARE affected_rows INT;
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;
        -- Extract values from JSON
        SET author_id_val = JSON_EXTRACT(p_data, '$.authorID');
        SET book_id_val = JSON_EXTRACT(p_data, '$.bookID');
        
        -- Update
        UPDATE BookAuthors
        SET authorID = author_id_val,
            bookID = book_id_val
        WHERE bookAuthorID = p_id;
        
        SET affected_rows = ROW_COUNT();
    COMMIT;
    
    -- Return the result as JSON
    IF affected_rows > 0 THEN
        SELECT JSON_OBJECT(
            'id', p_id,
            'authorID', author_id_val,
            'bookID', book_id_val
        ) as result;
    ELSE
        SELECT NULL as result;
    END IF;
END $$
DELIMITER ;

-- Delete BookAuthor relationship
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

-- =================================================================
-- BookGenres Missing Procedures
-- =================================================================

-- Dynamic create procedure for BookGenres table
DROP PROCEDURE IF EXISTS sp_dynamic_create_book_genres;
DELIMITER $$
CREATE PROCEDURE sp_dynamic_create_book_genres(
    IN p_data JSON
)
BEGIN
    DECLARE genre_id_val INT;
    DECLARE book_id_val INT;
    DECLARE insert_id INT;
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;
        -- Extract values from JSON
        SET genre_id_val = JSON_EXTRACT(p_data, '$.genreID');
        SET book_id_val = JSON_EXTRACT(p_data, '$.bookID');
        
        -- Insert
        INSERT INTO BookGenres (genreID, bookID)
        VALUES (genre_id_val, book_id_val);
        
        SET insert_id = LAST_INSERT_ID();
    COMMIT;
    
    -- Return the result as JSON
    SELECT JSON_OBJECT(
        'id', insert_id,
        'genreID', genre_id_val,
        'bookID', book_id_val
    ) as result;
END $$
DELIMITER ;

-- Delete BookGenre relationship
DROP PROCEDURE IF EXISTS sp_deleteBookGenre;
DELIMITER $$
CREATE PROCEDURE sp_deleteBookGenre(
    IN p_bookGenreID INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;
        DELETE FROM BookGenres WHERE bookGenreID = p_bookGenreID;
    COMMIT;
END $$
DELIMITER ;

-- =================================================================
-- BookLocations Missing Procedures
-- =================================================================

-- Dynamic create procedure for BookLocations table
DROP PROCEDURE IF EXISTS sp_dynamic_create_book_locations;
DELIMITER $$
CREATE PROCEDURE sp_dynamic_create_book_locations(
    IN p_data JSON
)
BEGIN
    DECLARE book_id_val INT;
    DECLARE sloc_id_val INT;
    DECLARE quantity_val INT;
    DECLARE insert_id INT;
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;
        -- Extract values from JSON
        SET book_id_val = JSON_EXTRACT(p_data, '$.bookID');
        SET sloc_id_val = JSON_EXTRACT(p_data, '$.slocID');
        SET quantity_val = JSON_EXTRACT(p_data, '$.quantity');
        
        -- Insert
        INSERT INTO BookLocations (bookID, slocID, quantity)
        VALUES (book_id_val, sloc_id_val, quantity_val);
        
        SET insert_id = LAST_INSERT_ID();
    COMMIT;
    
    -- Return the result as JSON
    SELECT JSON_OBJECT(
        'id', insert_id,
        'bookID', book_id_val,
        'slocID', sloc_id_val,
        'quantity', quantity_val
    ) as result;
END $$
DELIMITER ;

-- Dynamic update procedure for BookLocations table
DROP PROCEDURE IF EXISTS sp_dynamic_update_book_locations;
DELIMITER $$
CREATE PROCEDURE sp_dynamic_update_book_locations(
    IN p_id INT,
    IN p_data JSON
)
BEGIN
    DECLARE book_id_val INT;
    DECLARE sloc_id_val INT;
    DECLARE quantity_val INT;
    DECLARE affected_rows INT;
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;
        -- Extract values from JSON
        SET book_id_val = JSON_EXTRACT(p_data, '$.bookID');
        SET sloc_id_val = JSON_EXTRACT(p_data, '$.slocID');
        SET quantity_val = JSON_EXTRACT(p_data, '$.quantity');
        
        -- Update
        UPDATE BookLocations
        SET bookID = book_id_val,
            slocID = sloc_id_val,
            quantity = quantity_val
        WHERE bookLocationID = p_id;
        
        SET affected_rows = ROW_COUNT();
    COMMIT;
    
    -- Return the result as JSON
    IF affected_rows > 0 THEN
        SELECT JSON_OBJECT(
            'id', p_id,
            'bookID', book_id_val,
            'slocID', sloc_id_val,
            'quantity', quantity_val
        ) as result;
    ELSE
        SELECT NULL as result;
    END IF;
END $$
DELIMITER ;

-- Delete BookLocation relationship
DROP PROCEDURE IF EXISTS sp_deleteBookLocation;
DELIMITER $$
CREATE PROCEDURE sp_deleteBookLocation(
    IN p_bookLocationID INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;
        DELETE FROM BookLocations WHERE bookLocationID = p_bookLocationID;
    COMMIT;
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

-- =================================================================
-- Enhanced Dynamic Stored Procedures (Updated August 13, 2025)
-- =================================================================
-- These procedures include improved validation and error handling based on user feedback
-- 
-- CITATION: Based on user request to fix "Failed to save book" errors and improve validation feedback.
-- User reported: "When creating or updating a book, the price always results in 0.00" and 
-- "Failed to save book but does not tell me if I need to enter additional info or if this is a server error"
-- 
-- ADDITIONAL USER REQUESTS AND REFINEMENTS:
-- - User: "Publication date selects one day prior to the date I click on in the date pop up"
-- - User: "Author names showing with nulls as the middle and last names"
-- 
-- REFINEMENTS IMPLEMENTED:
-- - Fixed publication date off-by-one issue caused by timezone handling in date-fns
-- - Enhanced stored procedure validation with specific error messages using SIGNAL SQLSTATE
-- - Improved author name handling to convert empty strings to NULL for optional fields
-- - Added comprehensive validation for required fields (title, publicationDate, price)
-- - Enhanced error categorization for better user feedback
-- 
-- AI TOOL USAGE: Cursor AI was used to implement the timezone-safe date handling, enhanced 
--                validation logic, and improved error message display, addressing all user-reported issues.

-- =================================================================
-- Enhanced Dynamic Create Procedure for Books
-- =================================================================
DROP PROCEDURE IF EXISTS sp_dynamic_create_books;
DELIMITER $$
CREATE PROCEDURE sp_dynamic_create_books(
    IN p_data JSON
)
BEGIN
    DECLARE title_val VARCHAR(255);
    DECLARE pub_date_val DATE;
    DECLARE isbn10_val CHAR(13);
    DECLARE isbn13_val CHAR(17);
    DECLARE price_val DECIMAL(10,2);
    DECLARE inventory_val INT;
    DECLARE publisher_val INT;
    DECLARE instock_val TINYINT;
    DECLARE insert_id INT;
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;
        -- Extract values from JSON
        SET title_val = JSON_UNQUOTE(JSON_EXTRACT(p_data, '$.title'));
        SET pub_date_val = JSON_UNQUOTE(JSON_EXTRACT(p_data, '$.publicationDate'));
        SET isbn10_val = JSON_UNQUOTE(JSON_EXTRACT(p_data, '$."isbn-10"'));
        SET isbn13_val = JSON_UNQUOTE(JSON_EXTRACT(p_data, '$."isbn-13"'));
        
        -- Validate required fields
        IF title_val IS NULL OR title_val = '' THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Title is required and cannot be empty';
        END IF;
        
        IF pub_date_val IS NULL OR pub_date_val = '' THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Publication date is required and cannot be empty';
        END IF;
        
        -- Handle null values properly
        IF isbn10_val = 'null' OR isbn10_val = 'NULL' THEN SET isbn10_val = NULL; END IF;
        IF isbn13_val = 'null' OR isbn13_val = 'NULL' THEN SET isbn13_val = NULL; END IF;
        -- Convert price to DECIMAL properly
        SET price_val = CAST(JSON_UNQUOTE(JSON_EXTRACT(p_data, '$.price')) AS DECIMAL(10,2));
        
        -- Validate price
        IF price_val IS NULL OR price_val <= 0 THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Price must be a positive number';
        END IF;
        
        SET inventory_val = COALESCE(JSON_EXTRACT(p_data, '$.inventoryQty'), 0);
        SET publisher_val = JSON_EXTRACT(p_data, '$.publisherID');
        -- Handle inStock with default value if not provided
        SET instock_val = COALESCE(JSON_EXTRACT(p_data, '$.inStock'), 1);
        
        -- Insert with dynamic column handling
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
            title_val,
            pub_date_val,
            isbn10_val,
            isbn13_val,
            price_val,
            inventory_val,
            publisher_val,
            instock_val
        );
        
        SET insert_id = LAST_INSERT_ID();
    COMMIT;
    
    -- Return the result as JSON
    SELECT JSON_OBJECT(
        'id', insert_id,
        'title', title_val,
        'publicationDate', pub_date_val,
        'isbn-10', isbn10_val,
        'isbn-13', isbn13_val,
        'price', price_val,
        'inventoryQty', inventory_val,
        'publisherID', publisher_val,
        'inStock', instock_val
    ) as result;
END $$
DELIMITER ;

-- =================================================================
-- Enhanced Dynamic Update Procedure for Books
-- =================================================================
DROP PROCEDURE IF EXISTS sp_dynamic_update_books;
DELIMITER $$
CREATE PROCEDURE sp_dynamic_update_books(
    IN p_id INT,
    IN p_data JSON
)
BEGIN
    DECLARE title_val VARCHAR(255);
    DECLARE pub_date_val DATE;
    DECLARE price_val DECIMAL(10,2);
    DECLARE inventory_val INT;
    DECLARE publisher_val INT;
    DECLARE affected_rows INT;
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;
        -- Extract values from JSON
        SET title_val = JSON_UNQUOTE(JSON_EXTRACT(p_data, '$.title'));
        SET pub_date_val = JSON_UNQUOTE(JSON_EXTRACT(p_data, '$.publicationDate'));
        -- Convert price to DECIMAL properly
        SET price_val = CAST(JSON_UNQUOTE(JSON_EXTRACT(p_data, '$.price')) AS DECIMAL(10,2));
        
        -- Validate required fields
        IF title_val IS NULL OR title_val = '' THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Title is required and cannot be empty';
        END IF;
        
        IF pub_date_val IS NULL OR pub_date_val = '' THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Publication date is required and cannot be empty';
        END IF;
        
        -- Validate price
        IF price_val IS NULL OR price_val <= 0 THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Price must be a positive number';
        END IF;
        
        SET inventory_val = JSON_EXTRACT(p_data, '$.inventoryQty');
        SET publisher_val = JSON_EXTRACT(p_data, '$.publisherID');
        
        -- Update with dynamic column handling
        UPDATE Books
        SET
            title = title_val,
            publicationDate = pub_date_val,
            price = price_val,
            inventoryQty = inventory_val,
            publisherID = publisher_val
        WHERE bookID = p_id;
        
        SET affected_rows = ROW_COUNT();
    COMMIT;
    
    -- Return the result as JSON
    IF affected_rows > 0 THEN
        SELECT JSON_OBJECT(
            'id', p_id,
            'title', title_val,
            'publicationDate', pub_date_val,
            'price', price_val,
            'inventoryQty', inventory_val,
            'publisherID', publisher_val
        ) as result;
    ELSE
        SELECT NULL as result;
    END IF;
END $$
DELIMITER ;

-- =================================================================
-- Enhanced Dynamic Create Procedure for Authors
-- =================================================================
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

-- =================================================================
-- Enhanced Dynamic Update Procedure for Authors
-- =================================================================
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

-- =================================================================
-- Missing Stored Procedures for Other Models
-- =================================================================
-- These procedures are referenced in the models but were missing from PL.sql
-- 
-- CITATION: Added August 13, 2025 to ensure all model-referenced stored procedures exist
-- 
-- MISSING PROCEDURES IDENTIFIED:
-- - sp_dynamic_create_customers (referenced in CustomersModel.js)
-- - sp_dynamic_update_customers (referenced in CustomersModel.js)
-- - sp_dynamic_create_orders (referenced in OrdersModel.js)
-- - sp_dynamic_update_orders (referenced in OrdersModel.js)
-- - sp_dynamic_create_order_items (referenced in OrderItemsModel.js)
-- - sp_dynamic_update_order_items (referenced in OrderItemsModel.js)
-- - sp_dynamic_create_genres (referenced in GenresModel.js)
-- - sp_dynamic_update_genres (referenced in GenresModel.js)
-- - sp_dynamic_create_publishers (referenced in PublishersModel.js)
-- - sp_dynamic_update_publishers (referenced in PublishersModel.js)
-- - sp_dynamic_create_locations (referenced in LocationsModel.js)
-- - sp_dynamic_update_locations (referenced in LocationsModel.js)
-- - sp_dynamic_create_sales_rate_locations (referenced in SalesRateLocationsModel.js)
-- - sp_dynamic_update_sales_rate_locations (referenced in SalesRateLocationsModel.js)
-- 
-- AI TOOL USAGE: Cursor AI was used to identify missing procedures and implement them
--                based on the existing patterns in the models.

-- =================================================================
-- Customers Missing Procedures
-- =================================================================

-- Dynamic create procedure for Customers table
DROP PROCEDURE IF EXISTS sp_dynamic_create_customers;
DELIMITER $$
CREATE PROCEDURE sp_dynamic_create_customers(
    IN p_data JSON
)
BEGIN
    DECLARE first_name_val VARCHAR(100);
    DECLARE last_name_val VARCHAR(100);
    DECLARE email_val VARCHAR(255);
    DECLARE phone_val CHAR(10);
    DECLARE insert_id INT;
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;
        -- Extract values from JSON
        SET first_name_val = JSON_UNQUOTE(JSON_EXTRACT(p_data, '$.firstName'));
        SET last_name_val = JSON_UNQUOTE(JSON_EXTRACT(p_data, '$.lastName'));
        SET email_val = JSON_UNQUOTE(JSON_EXTRACT(p_data, '$.email'));
        SET phone_val = JSON_UNQUOTE(JSON_EXTRACT(p_data, '$.phoneNumber'));
        
        -- Insert
        INSERT INTO Customers (firstName, lastName, email, phoneNumber)
        VALUES (first_name_val, last_name_val, email_val, phone_val);
        
        SET insert_id = LAST_INSERT_ID();
    COMMIT;
    
    -- Return the result as JSON
    SELECT JSON_OBJECT(
        'id', insert_id,
        'firstName', first_name_val,
        'lastName', last_name_val,
        'email', email_val,
        'phoneNumber', phone_val
    ) as result;
END $$
DELIMITER ;

-- Dynamic update procedure for Customers table
DROP PROCEDURE IF EXISTS sp_dynamic_update_customers;
DELIMITER $$
CREATE PROCEDURE sp_dynamic_update_customers(
    IN p_id INT,
    IN p_data JSON
)
BEGIN
    DECLARE first_name_val VARCHAR(100);
    DECLARE last_name_val VARCHAR(100);
    DECLARE email_val VARCHAR(255);
    DECLARE phone_val CHAR(10);
    DECLARE affected_rows INT;
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;
        -- Extract values from JSON
        SET first_name_val = JSON_UNQUOTE(JSON_EXTRACT(p_data, '$.firstName'));
        SET last_name_val = JSON_UNQUOTE(JSON_EXTRACT(p_data, '$.lastName'));
        SET email_val = JSON_UNQUOTE(JSON_EXTRACT(p_data, '$.email'));
        SET phone_val = JSON_UNQUOTE(JSON_EXTRACT(p_data, '$.phoneNumber'));
        
        -- Update
        UPDATE Customers
        SET firstName = first_name_val,
            lastName = last_name_val,
            email = email_val,
            phoneNumber = phone_val
        WHERE customerID = p_id;
        
        SET affected_rows = ROW_COUNT();
    COMMIT;
    
    -- Return the result as JSON
    IF affected_rows > 0 THEN
        SELECT JSON_OBJECT(
            'id', p_id,
            'firstName', first_name_val,
            'lastName', last_name_val,
            'email', email_val,
            'phoneNumber', phone_val
        ) as result;
    ELSE
        SELECT NULL as result;
    END IF;
END $$
DELIMITER ;

-- =================================================================
-- Orders Missing Procedures
-- =================================================================

-- Dynamic create procedure for Orders table
DROP PROCEDURE IF EXISTS sp_dynamic_create_orders;
DELIMITER $$
CREATE PROCEDURE sp_dynamic_create_orders(
    IN p_data JSON
)
BEGIN
    DECLARE order_date_val DATE;
    DECLARE order_time_val TIME;
    DECLARE total_val DECIMAL(10,2);
    DECLARE tax_rate_val DECIMAL(6,4);
    DECLARE customer_id_val INT;
    DECLARE sales_rate_id_val INT;
    DECLARE insert_id INT;
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;
        -- Extract values from JSON
        SET order_date_val = JSON_UNQUOTE(JSON_EXTRACT(p_data, '$.orderDate'));
        SET order_time_val = JSON_UNQUOTE(JSON_EXTRACT(p_data, '$.orderTime'));
        SET total_val = JSON_EXTRACT(p_data, '$.total');
        SET tax_rate_val = JSON_EXTRACT(p_data, '$.taxRate');
        SET customer_id_val = JSON_EXTRACT(p_data, '$.customerID');
        SET sales_rate_id_val = JSON_EXTRACT(p_data, '$.salesRateID');
        
        -- Insert
        INSERT INTO Orders (orderDate, orderTime, total, taxRate, customerID, salesRateID)
        VALUES (order_date_val, order_time_val, total_val, tax_rate_val, customer_id_val, sales_rate_id_val);
        
        SET insert_id = LAST_INSERT_ID();
    COMMIT;
    
    -- Return the result as JSON
    SELECT JSON_OBJECT(
        'id', insert_id,
        'orderDate', order_date_val,
        'orderTime', order_time_val,
        'total', total_val,
        'taxRate', tax_rate_val,
        'customerID', customer_id_val,
        'salesRateID', sales_rate_id_val
    ) as result;
END $$
DELIMITER ;

-- Dynamic update procedure for Orders table
DROP PROCEDURE IF EXISTS sp_dynamic_update_orders;
DELIMITER $$
CREATE PROCEDURE sp_dynamic_update_orders(
    IN p_id INT,
    IN p_data JSON
)
BEGIN
    DECLARE order_date_val DATE;
    DECLARE order_time_val TIME;
    DECLARE total_val DECIMAL(10,2);
    DECLARE tax_rate_val DECIMAL(6,4);
    DECLARE customer_id_val INT;
    DECLARE sales_rate_id_val INT;
    DECLARE affected_rows INT;
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;
        -- Extract values from JSON
        SET order_date_val = JSON_UNQUOTE(JSON_EXTRACT(p_data, '$.orderDate'));
        SET order_time_val = JSON_UNQUOTE(JSON_EXTRACT(p_data, '$.orderTime'));
        SET total_val = JSON_EXTRACT(p_data, '$.total');
        SET tax_rate_val = JSON_EXTRACT(p_data, '$.taxRate');
        SET customer_id_val = JSON_EXTRACT(p_data, '$.customerID');
        SET sales_rate_id_val = JSON_EXTRACT(p_data, '$.salesRateID');
        
        -- Update
        UPDATE Orders
        SET orderDate = order_date_val,
            orderTime = order_time_val,
            total = total_val,
            taxRate = tax_rate_val,
            customerID = customer_id_val,
            salesRateID = sales_rate_id_val
        WHERE orderID = p_id;
        
        SET affected_rows = ROW_COUNT();
    COMMIT;
    
    -- Return the result as JSON
    IF affected_rows > 0 THEN
        SELECT JSON_OBJECT(
            'id', p_id,
            'orderDate', order_date_val,
            'orderTime', order_time_val,
            'total', total_val,
            'taxRate', tax_rate_val,
            'customerID', customer_id_val,
            'salesRateID', sales_rate_id_val
        ) as result;
    ELSE
        SELECT NULL as result;
    END IF;
END $$
DELIMITER ;

-- =================================================================
-- OrderItems Missing Procedures
-- =================================================================

-- Dynamic create procedure for OrderItems table
DROP PROCEDURE IF EXISTS sp_dynamic_create_order_items;
DELIMITER $$
CREATE PROCEDURE sp_dynamic_create_order_items(
    IN p_data JSON
)
BEGIN
    DECLARE order_id_val INT;
    DECLARE book_id_val INT;
    DECLARE quantity_val INT;
    DECLARE individual_price_val DECIMAL(10,2);
    DECLARE subtotal_val DECIMAL(10,2);
    DECLARE insert_id INT;
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;
        -- Extract values from JSON
        SET order_id_val = JSON_EXTRACT(p_data, '$.orderID');
        SET book_id_val = JSON_EXTRACT(p_data, '$.bookID');
        SET quantity_val = JSON_EXTRACT(p_data, '$.quantity');
        SET individual_price_val = JSON_EXTRACT(p_data, '$.individualPrice');
        SET subtotal_val = JSON_EXTRACT(p_data, '$.subtotal');
        
        -- Insert
        INSERT INTO OrderItems (orderID, bookID, quantity, individualPrice, subtotal)
        VALUES (order_id_val, book_id_val, quantity_val, individual_price_val, subtotal_val);
        
        SET insert_id = LAST_INSERT_ID();
    COMMIT;
    
    -- Return the result as JSON
    SELECT JSON_OBJECT(
        'id', insert_id,
        'orderID', order_id_val,
        'bookID', book_id_val,
        'quantity', quantity_val,
        'individualPrice', individual_price_val,
        'subtotal', subtotal_val
    ) as result;
END $$
DELIMITER ;

-- Dynamic update procedure for OrderItems table
DROP PROCEDURE IF EXISTS sp_dynamic_update_order_items;
DELIMITER $$
CREATE PROCEDURE sp_dynamic_update_order_items(
    IN p_id INT,
    IN p_data JSON
)
BEGIN
    DECLARE order_id_val INT;
    DECLARE book_id_val INT;
    DECLARE quantity_val INT;
    DECLARE individual_price_val DECIMAL(10,2);
    DECLARE subtotal_val DECIMAL(10,2);
    DECLARE affected_rows INT;
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;
        -- Extract values from JSON
        SET order_id_val = JSON_EXTRACT(p_data, '$.orderID');
        SET book_id_val = JSON_EXTRACT(p_data, '$.bookID');
        SET quantity_val = JSON_EXTRACT(p_data, '$.quantity');
        SET individual_price_val = JSON_EXTRACT(p_data, '$.individualPrice');
        SET subtotal_val = JSON_EXTRACT(p_data, '$.subtotal');
        
        -- Update
        UPDATE OrderItems
        SET orderID = order_id_val,
            bookID = book_id_val,
            quantity = quantity_val,
            individualPrice = individual_price_val,
            subtotal = subtotal_val
        WHERE orderItemID = p_id;
        
        SET affected_rows = ROW_COUNT();
    COMMIT;
    
    -- Return the result as JSON
    IF affected_rows > 0 THEN
        SELECT JSON_OBJECT(
            'id', p_id,
            'orderID', order_id_val,
            'bookID', book_id_val,
            'quantity', quantity_val,
            'individualPrice', individual_price_val,
            'subtotal', subtotal_val
        ) as result;
    ELSE
        SELECT NULL as result;
    END IF;
END $$
DELIMITER ;

-- =================================================================
-- Genres Missing Procedures
-- =================================================================

-- Dynamic create procedure for Genres table
DROP PROCEDURE IF EXISTS sp_dynamic_create_genres;
DELIMITER $$
CREATE PROCEDURE sp_dynamic_create_genres(
    IN p_data JSON
)
BEGIN
    DECLARE genre_name_val VARCHAR(255);
    DECLARE insert_id INT;
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;
        -- Extract values from JSON
        SET genre_name_val = JSON_UNQUOTE(JSON_EXTRACT(p_data, '$.genreName'));
        
        -- Insert
        INSERT INTO Genres (genreName)
        VALUES (genre_name_val);
        
        SET insert_id = LAST_INSERT_ID();
    COMMIT;
    
    -- Return the result as JSON
    SELECT JSON_OBJECT(
        'id', insert_id,
        'genreName', genre_name_val
    ) as result;
END $$
DELIMITER ;

-- Dynamic update procedure for Genres table
DROP PROCEDURE IF EXISTS sp_dynamic_update_genres;
DELIMITER $$
CREATE PROCEDURE sp_dynamic_update_genres(
    IN p_id INT,
    IN p_data JSON
)
BEGIN
    DECLARE genre_name_val VARCHAR(255);
    DECLARE affected_rows INT;
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;
        -- Extract values from JSON
        SET genre_name_val = JSON_UNQUOTE(JSON_EXTRACT(p_data, '$.genreName'));
        
        -- Update
        UPDATE Genres
        SET genreName = genre_name_val
        WHERE genreID = p_id;
        
        SET affected_rows = ROW_COUNT();
    COMMIT;
    
    -- Return the result as JSON
    IF affected_rows > 0 THEN
        SELECT JSON_OBJECT(
            'id', p_id,
            'genreName', genre_name_val
        ) as result;
    ELSE
        SELECT NULL as result;
    END IF;
END $$
DELIMITER ;

-- =================================================================
-- Publishers Missing Procedures
-- =================================================================

-- Dynamic create procedure for Publishers table
DROP PROCEDURE IF EXISTS sp_dynamic_create_publishers;
DELIMITER $$
CREATE PROCEDURE sp_dynamic_create_publishers(
    IN p_data JSON
)
BEGIN
    DECLARE publisher_name_val VARCHAR(255);
    DECLARE insert_id INT;
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;
        -- Extract values from JSON
        SET publisher_name_val = JSON_UNQUOTE(JSON_EXTRACT(p_data, '$.publisherName'));
        
        -- Insert
        INSERT INTO Publishers (publisherName)
        VALUES (publisher_name_val);
        
        SET insert_id = LAST_INSERT_ID();
    COMMIT;
    
    -- Return the result as JSON
    SELECT JSON_OBJECT(
        'id', insert_id,
        'publisherName', publisher_name_val
    ) as result;
END $$
DELIMITER ;

-- Dynamic update procedure for Publishers table
DROP PROCEDURE IF EXISTS sp_dynamic_update_publishers;
DELIMITER $$
CREATE PROCEDURE sp_dynamic_update_publishers(
    IN p_id INT,
    IN p_data JSON
)
BEGIN
    DECLARE publisher_name_val VARCHAR(255);
    DECLARE affected_rows INT;
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;
        -- Extract values from JSON
        SET publisher_name_val = JSON_UNQUOTE(JSON_EXTRACT(p_data, '$.publisherName'));
        
        -- Update
        UPDATE Publishers
        SET publisherName = publisher_name_val
        WHERE publisherID = p_id;
        
        SET affected_rows = ROW_COUNT();
    COMMIT;
    
    -- Return the result as JSON
    IF affected_rows > 0 THEN
        SELECT JSON_OBJECT(
            'id', p_id,
            'publisherName', publisher_name_val
        ) as result;
    ELSE
        SELECT NULL as result;
    END IF;
END $$
DELIMITER ;

-- =================================================================
-- Locations Missing Procedures
-- =================================================================

-- Dynamic create procedure for Locations table
DROP PROCEDURE IF EXISTS sp_dynamic_create_locations;
DELIMITER $$
CREATE PROCEDURE sp_dynamic_create_locations(
    IN p_data JSON
)
BEGIN
    DECLARE sloc_name_val VARCHAR(45);
    DECLARE insert_id INT;
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;
        -- Extract values from JSON
        SET sloc_name_val = JSON_UNQUOTE(JSON_EXTRACT(p_data, '$.slocName'));
        
        -- Insert
        INSERT INTO SLOCS (slocName)
        VALUES (sloc_name_val);
        
        SET insert_id = LAST_INSERT_ID();
    COMMIT;
    
    -- Return the result as JSON
    SELECT JSON_OBJECT(
        'id', insert_id,
        'slocName', sloc_name_val
    ) as result;
END $$
DELIMITER ;

-- Dynamic update procedure for Locations table
DROP PROCEDURE IF EXISTS sp_dynamic_update_locations;
DELIMITER $$
CREATE PROCEDURE sp_dynamic_update_locations(
    IN p_id INT,
    IN p_data JSON
)
BEGIN
    DECLARE sloc_name_val VARCHAR(45);
    DECLARE affected_rows INT;
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;
        -- Extract values from JSON
        SET sloc_name_val = JSON_UNQUOTE(JSON_EXTRACT(p_data, '$.slocName'));
        
        -- Update
        UPDATE SLOCS
        SET slocName = sloc_name_val
        WHERE slocID = p_id;
        
        SET affected_rows = ROW_COUNT();
    COMMIT;
    
    -- Return the result as JSON
    IF affected_rows > 0 THEN
        SELECT JSON_OBJECT(
            'id', p_id,
            'slocName', sloc_name_val
        ) as result;
    ELSE
        SELECT NULL as result;
    END IF;
END $$
DELIMITER ;

-- =================================================================
-- SalesRateLocations Missing Procedures
-- =================================================================

-- Dynamic create procedure for SalesRateLocations table
DROP PROCEDURE IF EXISTS sp_dynamic_create_sales_rate_locations;
DELIMITER $$
CREATE PROCEDURE sp_dynamic_create_sales_rate_locations(
    IN p_data JSON
)
BEGIN
    DECLARE county_val VARCHAR(45);
    DECLARE state_val VARCHAR(45);
    DECLARE tax_rate_val DECIMAL(6,4);
    DECLARE insert_id INT;
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;
        -- Extract values from JSON
        SET county_val = JSON_UNQUOTE(JSON_EXTRACT(p_data, '$.county'));
        SET state_val = JSON_UNQUOTE(JSON_EXTRACT(p_data, '$.state'));
        SET tax_rate_val = JSON_EXTRACT(p_data, '$.taxRate');
        
        -- Insert
        INSERT INTO SalesRateLocations (county, state, taxRate)
        VALUES (county_val, state_val, tax_rate_val);
        
        SET insert_id = LAST_INSERT_ID();
    COMMIT;
    
    -- Return the result as JSON
    SELECT JSON_OBJECT(
        'id', insert_id,
        'county', county_val,
        'state', state_val,
        'taxRate', tax_rate_val
    ) as result;
END $$
DELIMITER ;

-- Dynamic update procedure for SalesRateLocations table
DROP PROCEDURE IF EXISTS sp_dynamic_update_sales_rate_locations;
DELIMITER $$
CREATE PROCEDURE sp_dynamic_update_sales_rate_locations(
    IN p_id INT,
    IN p_data JSON
)
BEGIN
    DECLARE county_val VARCHAR(45);
    DECLARE state_val VARCHAR(45);
    DECLARE tax_rate_val DECIMAL(6,4);
    DECLARE affected_rows INT;
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;
        -- Extract values from JSON
        SET county_val = JSON_UNQUOTE(JSON_EXTRACT(p_data, '$.county'));
        SET state_val = JSON_UNQUOTE(JSON_EXTRACT(p_data, '$.state'));
        SET tax_rate_val = JSON_EXTRACT(p_data, '$.taxRate');
        
        -- Update
        UPDATE SalesRateLocations
        SET county = county_val,
            state = state_val,
            taxRate = tax_rate_val
        WHERE salesRateID = p_id;
        
        SET affected_rows = ROW_COUNT();
    COMMIT;
    
    -- Return the result as JSON
    IF affected_rows > 0 THEN
        SELECT JSON_OBJECT(
            'id', p_id,
            'county', county_val,
            'state', state_val,
            'taxRate', tax_rate_val
        ) as result;
    ELSE
        SELECT NULL as result;
    END IF;
END $$
DELIMITER ;

-- =================================================================
-- Missing Delete Procedures (Referenced in Models)
-- =================================================================
-- These delete procedures are referenced in the models but were missing from PL.sql
-- 
-- CITATION: Added August 13, 2025 to ensure all model-referenced delete procedures exist
-- 
-- MISSING DELETE PROCEDURES IDENTIFIED:
-- - sp_deleteGenre (referenced in GenresModel.js)
-- - sp_deletePublisher (referenced in PublishersModel.js)
-- - sp_deleteSLOC (referenced in LocationsModel.js)
-- - sp_deleteSalesRateLocation (referenced in SalesRateLocationsModel.js)
-- 
-- AI TOOL USAGE: Cursor AI was used to identify missing delete procedures and implement them
--                based on the existing patterns in the models.

-- Delete Genre
DROP PROCEDURE IF EXISTS sp_deleteGenre;
DELIMITER $$
CREATE PROCEDURE sp_deleteGenre(
    IN p_genreID INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;
        DELETE FROM Genres WHERE genreID = p_genreID;
    COMMIT;
END $$
DELIMITER ;

-- Delete Publisher
DROP PROCEDURE IF EXISTS sp_deletePublisher;
DELIMITER $$
CREATE PROCEDURE sp_deletePublisher(
    IN p_publisherID INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;
        DELETE FROM Publishers WHERE publisherID = p_publisherID;
    COMMIT;
END $$
DELIMITER ;

-- Delete SLOC (Location)
DROP PROCEDURE IF EXISTS sp_deleteSLOC;
DELIMITER $$
CREATE PROCEDURE sp_deleteSLOC(
    IN p_slocID INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;
        DELETE FROM SLOCS WHERE slocID = p_slocID;
    COMMIT;
END $$
DELIMITER ;

-- Delete SalesRateLocation
DROP PROCEDURE IF EXISTS sp_deleteSalesRateLocation;
DELIMITER $$
CREATE PROCEDURE sp_deleteSalesRateLocation(
    IN p_salesRateID INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;
        DELETE FROM SalesRateLocations WHERE salesRateID = p_salesRateID;
    COMMIT;
END $$
DELIMITER ;

