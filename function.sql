DELIMITER //

CREATE FUNCTION func_movie_rental_count(movie_name VARCHAR(255))
RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE rental_count INT;
    
    SELECT RentalCount INTO rental_count
    FROM v_topmovies
    WHERE MovieTitle = movie_name;
    
    RETURN rental_count;
END //

DELIMITER ;
-- Tests to Verify the Function
-- Test with Existing Movie Title
   SELECT func_movie_rental_count('Football Follies') AS RentalCount;
-- Expected Result:

-- RentalCount: 2
-- Test with Another Existing Movie Title
   SELECT func_movie_rental_count('Mountain Mystery') AS RentalCount;