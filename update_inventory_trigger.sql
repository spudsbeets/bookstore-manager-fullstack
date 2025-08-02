-- Trigger to automatically update books.inventoryQty when BookLocations change
-- This keeps the books table in sync with actual inventory quantities

-- First, create a function to calculate total inventory for a book
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

-- Trigger to update books.inventoryQty after INSERT on BookLocations
CREATE TRIGGER after_booklocation_insert
AFTER INSERT ON BookLocations
FOR EACH ROW
BEGIN
    UPDATE Books 
    SET inventoryQty = CalculateBookInventory(NEW.bookID)
    WHERE bookID = NEW.bookID;
END$$

-- Trigger to update books.inventoryQty after UPDATE on BookLocations
CREATE TRIGGER after_booklocation_update
AFTER UPDATE ON BookLocations
FOR EACH ROW
BEGIN
    UPDATE Books 
    SET inventoryQty = CalculateBookInventory(NEW.bookID)
    WHERE bookID = NEW.bookID;
END$$

-- Trigger to update books.inventoryQty after DELETE on BookLocations
CREATE TRIGGER after_booklocation_delete
AFTER DELETE ON BookLocations
FOR EACH ROW
BEGIN
    UPDATE Books 
    SET inventoryQty = CalculateBookInventory(OLD.bookID)
    WHERE bookID = OLD.bookID;
END$$

DELIMITER ;

-- Update all existing books to have correct inventory quantities
UPDATE Books b 
SET inventoryQty = (
    SELECT COALESCE(SUM(bl.quantity), 0)
    FROM BookLocations bl
    WHERE bl.bookID = b.bookID
); 