#!/bin/bash

echo "Setting up MySQL database..."

# Wait for MySQL to be ready
echo "Waiting for MySQL to be ready..."
sleep 10

# Drop existing tables if they exist
echo "Dropping existing tables..."
docker exec -i mysql-dev mysql -uroot -psecretpassword demo << EOF
DROP TABLE IF EXISTS BookGenres;
DROP TABLE IF EXISTS BookAuthors;
DROP TABLE IF EXISTS BookLocations;
DROP TABLE IF EXISTS OrderItems;
DROP TABLE IF EXISTS Orders;
DROP TABLE IF EXISTS SalesRateLocations;
DROP TABLE IF EXISTS SLOCS;
DROP TABLE IF EXISTS Genres;
DROP TABLE IF EXISTS Authors;
DROP TABLE IF EXISTS Books;
DROP TABLE IF EXISTS Customers;
DROP TABLE IF EXISTS Publishers;
EOF

# Create the database and tables
echo "Creating database and tables..."
docker exec -i mysql-dev mysql -uroot -psecretpassword demo < DDL.sql

echo "Database setup complete!"
echo "You can now start the backend server with: cd controllerAndModel && npm run dev" 