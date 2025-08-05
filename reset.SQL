-- citation: Gemini
-- 08/04/25
-- Asked Gemini to combine and make sure it was robust against sql injection (combined reset and PL)

-- =================================================================
-- Books
-- =================================================================

-- Insert Book
-- =================================================================
-- Database Initialization and Data Loading
-- =================================================================
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

CALL sp_load_bookdb();

-- =================================================================
-- Books
-- =================================================================



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
        -- No need to manually delete from BookAuthors due to ON DELETE CASCADE
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
-- New Dynamic Stored Procedures for Models
-- =================================================================
DELIMITER ;

-- Dynamic create procedure for Books table
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
        
        -- Handle null values properly
        IF isbn10_val = 'null' OR isbn10_val = 'NULL' THEN SET isbn10_val = NULL; END IF;
        IF isbn13_val = 'null' OR isbn13_val = 'NULL' THEN SET isbn13_val = NULL; END IF;
        SET price_val = JSON_EXTRACT(p_data, '$.price');
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

-- Dynamic update procedure for Books table
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
        SET price_val = JSON_EXTRACT(p_data, '$.price');
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

-- Dynamic create procedure for Authors table
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
        
        -- Handle null values properly
        IF phone_val = 'null' OR phone_val = 'NULL' OR phone_val = '' THEN SET phone_val = NULL; END IF;
        IF email_val = 'null' OR email_val = 'NULL' OR email_val = '' THEN SET email_val = NULL; END IF;
        
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
        
        -- Handle null values properly
        IF phone_val = 'null' OR phone_val = 'NULL' OR phone_val = '' THEN SET phone_val = NULL; END IF;
        IF email_val = 'null' OR email_val = 'NULL' OR email_val = '' THEN SET email_val = NULL; END IF;
        
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

-- Dynamic create procedure for Locations (SLOCS) table
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

-- Dynamic update procedure for Locations (SLOCS) table
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

-- Dynamic update procedure for BookGenres table
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

-- Dynamic delete procedure for any table
DROP PROCEDURE IF EXISTS sp_dynamic_delete;
DELIMITER $$
CREATE PROCEDURE sp_dynamic_delete(
    IN p_tableName VARCHAR(255),
    IN p_idColumn VARCHAR(255),
    IN p_id INT
)
BEGIN
    DECLARE affected_rows INT;
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;
        -- Build and execute dynamic SQL
        SET @sql = CONCAT('DELETE FROM ', p_tableName, ' WHERE ', p_idColumn, ' = ?');
        PREPARE stmt FROM @sql;
        EXECUTE stmt USING p_id;
        SET affected_rows = ROW_COUNT();
        DEALLOCATE PREPARE stmt;
    COMMIT;
    
    -- Return the result
    SELECT affected_rows > 0 as success;
END $$
DELIMITER ;

-- Dynamic update procedure for any table
DROP PROCEDURE IF EXISTS sp_dynamic_update;
DELIMITER $$
CREATE PROCEDURE sp_dynamic_update(
    IN p_tableName VARCHAR(255),
    IN p_id INT,
    IN p_data JSON
)
BEGIN
    DECLARE set_clause TEXT DEFAULT '';
    DECLARE column_name VARCHAR(255);
    DECLARE column_value TEXT;
    DECLARE i INT DEFAULT 0;
    DECLARE data_length INT;
    DECLARE dynamic_sql TEXT;
    DECLARE affected_rows INT;
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;
        -- Build SET clause dynamically
        SET data_length = JSON_LENGTH(p_data);
        
        WHILE i < data_length DO
            SET column_name = JSON_UNQUOTE(JSON_EXTRACT(JSON_KEYS(p_data), CONCAT('$[', i, ']')));
            SET column_value = JSON_UNQUOTE(JSON_EXTRACT(p_data, CONCAT('$.', column_name)));
            
            -- Handle column names with hyphens
            IF column_name LIKE '%-%' THEN
                SET column_name = CONCAT('`', column_name, '`');
            END IF;
            
            IF i > 0 THEN
                SET set_clause = CONCAT(set_clause, ', ', column_name, ' = ?');
            ELSE
                SET set_clause = CONCAT(column_name, ' = ?');
            END IF;
            
            SET i = i + 1;
        END WHILE;
        
        -- Build and execute dynamic SQL
        SET dynamic_sql = CONCAT('UPDATE ', p_tableName, ' SET ', set_clause, ' WHERE id = ?');
        
        -- Execute the dynamic SQL
        SET @sql = dynamic_sql;
        PREPARE stmt FROM @sql;
        
        -- We need to handle the values separately since we can't pass them directly to PREPARE
        -- This is a limitation, so we'll use a different approach
        -- For now, we'll create specific procedures for each table
        
        DEALLOCATE PREPARE stmt;
    COMMIT;
END $$
DELIMITER ;

-- =================================================================
-- Views
-- =================================================================

-- Books view with publisher and relationships
DROP VIEW IF EXISTS v_books;
CREATE VIEW v_books AS
SELECT
    b.bookID,
    b.title,
    b.publicationDate,
    b.`isbn-10`,
    b.`isbn-13`,
    b.price,
    b.inventoryQty,
    b.inStock,
    p.publisherName AS publisher,
    GROUP_CONCAT(DISTINCT a.fullName SEPARATOR ', ') AS authors,
    GROUP_CONCAT(DISTINCT g.genreName SEPARATOR ', ') AS genres
FROM Books b
LEFT JOIN Publishers p ON b.publisherID = p.publisherID
LEFT JOIN BookAuthors ba ON b.bookID = ba.bookID
LEFT JOIN Authors a ON ba.authorID = a.authorID
LEFT JOIN BookGenres bg ON b.bookID = bg.bookID
LEFT JOIN Genres g ON bg.genreID = g.genreID
GROUP BY b.bookID;

-- =================================================================
-- Additional Views for Books Queries
-- =================================================================

-- View for books with publisher info (for findByTitle and findByPublisher)
DROP VIEW IF EXISTS v_books_with_publisher;
CREATE VIEW v_books_with_publisher AS
SELECT 
    b.bookID,
    b.title,
    b.publicationDate,
    b.`isbn-10`,
    b.`isbn-13`,
    b.price,
    b.inventoryQty,
    b.inStock,
    b.publisherID,
    p.publisherName
FROM Books b
LEFT JOIN Publishers p ON b.publisherID = p.publisherID;

-- View for books in stock with publisher info (for findInStock)
DROP VIEW IF EXISTS v_books_in_stock;
CREATE VIEW v_books_in_stock AS
SELECT 
    b.bookID,
    b.title,
    b.publicationDate,
    b.`isbn-10`,
    b.`isbn-13`,
    b.price,
    b.inventoryQty,
    b.inStock,
    b.publisherID,
    p.publisherName
FROM Books b
LEFT JOIN Publishers p ON b.publisherID = p.publisherID
WHERE b.inStock = 1;

-- View for single book with publisher info (for findById)
DROP VIEW IF EXISTS v_book_with_publisher;
CREATE VIEW v_book_with_publisher AS
SELECT 
    b.bookID,
    b.title,
    b.publicationDate,
    b.`isbn-10`,
    b.`isbn-13`,
    b.price,
    b.inventoryQty,
    b.inStock,
    b.publisherID,
    p.publisherName
FROM Books b
LEFT JOIN Publishers p ON b.publisherID = p.publisherID;

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

-- =================================================================
-- Missing Delete Procedures
-- =================================================================

-- Delete a genre
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
        -- First, remove associations in BookGenres to maintain referential integrity
        DELETE FROM BookGenres WHERE genreID = p_genreID;
        -- Then, delete the genre
        DELETE FROM Genres WHERE genreID = p_genreID;
    COMMIT;
END $$
DELIMITER ;

-- Delete a publisher
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
        -- First, update books to set publisherID to NULL
        UPDATE Books SET publisherID = NULL WHERE publisherID = p_publisherID;
        -- Then, delete the publisher
        DELETE FROM Publishers WHERE publisherID = p_publisherID;
    COMMIT;
END $$
DELIMITER ;

-- Delete a sales rate location
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

-- Delete a location (SLOC)
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
        -- First, remove associations in BookLocations to maintain referential integrity
        DELETE FROM BookLocations WHERE slocID = p_slocID;
        -- Then, delete the location
        DELETE FROM SLOCS WHERE slocID = p_slocID;
    COMMIT;
END $$
DELIMITER ;

-- Delete an order item
DROP PROCEDURE IF EXISTS sp_deleteOrderItem;
DELIMITER $$
CREATE PROCEDURE sp_deleteOrderItem(
    IN p_orderItemID INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;
        DELETE FROM OrderItems WHERE orderItemID = p_orderItemID;
    COMMIT;
END $$
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

-- Delete a book genre relationship
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

-- Delete a book location relationship
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
