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
  VALUES  (4.2, 'Polk', 'Iowa'),
          (5.1, 'Jerome', 'Idaho'),
          (8.625, 'San Francisco', 'California');

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
  SELECT '2025-10-01', '21:12:11', 45.61, SalesRateLocations.taxRate, customerID, SalesRateLocations.salesRateID
  FROM Customers 
  JOIN SalesRateLocations ON SalesRateLocations.taxRate = 4.2
  WHERE Customers.firstName = 'Reggie' AND Customers.lastName = 'Reggerson';

  INSERT INTO Orders(
      orderDate,
      orderTime,
      total,
      taxRate,
      customerID,
      salesRateID
      )
  SELECT '2025-10-01', '21:12:11', 61.21, SalesRateLocations.taxRate, customerID, SalesRateLocations.salesRateID
  FROM Customers 
  JOIN SalesRateLocations ON SalesRateLocations.taxRate = 5.1
  WHERE Customers.firstName = 'Gail' AND Customers.lastName = 'Nightingstocks';

  INSERT INTO Orders(
      orderDate,
      orderTime,
      total,
      taxRate,
      customerID,
      salesRateID
      )
  SELECT '2025-12-09', '08:24:24', 112.09, SalesRateLocations.taxRate, customerID, SalesRateLocations.salesRateID
  FROM Customers 
  JOIN SalesRateLocations ON SalesRateLocations.taxRate = 8.625
  WHERE Customers.firstName = 'Filipe' AND Customers.lastName = 'Redsky';

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