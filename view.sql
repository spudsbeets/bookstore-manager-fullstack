CREATE VIEW v_topmovies AS
SELECT 
    m.Item AS MovieTitle,
    g.Description AS Genre,
    COUNT(rm.MovieID) AS RentalCount
FROM 
    `movie-Movies` m
JOIN 
    `movie-Genre` g ON m.GenreID = g.GenreID
JOIN 
    `movie-RentalMovies` rm ON m.MovieID = rm.MovieID
GROUP BY 
    m.Item, g.Description
ORDER BY 
    RentalCount DESC;
-- I executed this in my database and it compiled without any errors, which is a good start!
-- Executing this SP generates the following results: 
SELECT * from v_topmovies;
