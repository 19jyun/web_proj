CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);

SHOW GRANTS FOR 'root'@'localhost';

GRANT ALL PRIVILEGES ON your_database.* TO 'your_username'@'localhost';
FLUSH PRIVILEGES;