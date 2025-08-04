DELIMITER //
CREATE PROCEDURE sp_insert_movie (
    IN p_Item VARCHAR(255),
    IN p_GenreID VARCHAR(255),
    IN p_Rating VARCHAR(255),
    IN p_Active TINYINT(1),
    OUT p_NewMovieID INT
)
COMMENT 'Insert movie title and return new id.'
BEGIN
    INSERT INTO `movie-Movies` (Item, GenreID, Rating, Active)
    VALUES (p_Item, p_GenreID, p_Rating, p_Active);
    
    SET p_NewMovieID = LAST_INSERT_ID();
END //
DELIMITER ;

DELIMITER //

CREATE PROCEDURE sp_delete_customer(IN p_CustomerID INT)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        -- Rollback the transaction in case of any error
        ROLLBACK;
        SELECT 'Error! Customer not deleted.' AS Result;
    END;

    -- Start the transaction
    START TRANSACTION;
    -- Delete from movie-Rentals table
    DELETE FROM `movie-Rentals` WHERE `CustomerID` = p_CustomerID;
    -- Delete from movie-Customers table
    DELETE FROM `movie-Customers` WHERE `MemberID` = p_CustomerID;
    -- Commit the transaction
    COMMIT;

    -- Return success message
    SELECT 'Customer deleted' AS Result;
END //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE sp_modify_Movies_rentalCount()
COMMENT 'Modify the Moviesdb schema by adding rentalCount to movie-Movies table.'
BEGIN
    -- Add the rentalCount column to the movie-Movies table
    ALTER TABLE `movie-Movies` ADD COLUMN `rentalCount` INTEGER DEFAULT 0;
END //
DELIMITER ;
To test that this stored procedure executed properly, you can query the information schema before and after running the stored procedure:

-- Query the information schema before running the stored procedure
SELECT COLUMN_NAME
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'movie-Movies'
AND TABLE_SCHEMA = DATABASE();

-- Run the stored procedure
CALL sp_modify_Movies_rentalCount();

-- Query the information schema after running the stored procedure
SELECT COLUMN_NAME
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'movie-Movies'
AND TABLE_SCHEMA = DATABASE();


DROP PROCEDURE IF EXISTS sp_update_rentalCount;
DELIMITER //

CREATE PROCEDURE sp_update_rentalCount()
COMMENT 'update total of movie-Movies.rentalCount from movie-RentalMovies'
BEGIN
    -- Update the rentalCount for each movie based on the number of rentals
    UPDATE `movie-Movies` m
    LEFT JOIN (
        SELECT `MovieID`, COUNT(*) AS rentalCount
        FROM `movie-RentalMovies`
        GROUP BY `MovieID`
    ) r ON m.`MovieID` = r.`MovieID`
    SET m.`rentalCount` = IFNULL(r.rentalCount, 0);
END //

DELIMITER ;