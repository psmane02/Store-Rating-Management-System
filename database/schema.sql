CREATE DATABASE IF NOT EXISTS roxiler_store_rating;

USE roxiler_store_rating;


-- USERS TABLE


CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,

    name VARCHAR(60) NOT NULL,

    email VARCHAR(255) NOT NULL UNIQUE,

    password VARCHAR(255) NOT NULL,

    address VARCHAR(400) NOT NULL,

    role ENUM('ADMIN', 'USER', 'OWNER') NOT NULL DEFAULT 'USER',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



-- STORES TABLE


CREATE TABLE stores (
    id INT PRIMARY KEY AUTO_INCREMENT,

    name VARCHAR(60) NOT NULL,

    email VARCHAR(255),

    address VARCHAR(400) NOT NULL,

    owner_id INT UNIQUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (owner_id)
        REFERENCES users(id)
        ON DELETE SET NULL
);



-- RATINGS TABLE


CREATE TABLE ratings (
    id INT PRIMARY KEY AUTO_INCREMENT,

    user_id INT NOT NULL,

    store_id INT NOT NULL,

    rating TINYINT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    FOREIGN KEY (store_id)
        REFERENCES stores(id)
        ON DELETE CASCADE,

    UNIQUE(user_id, store_id),

    CHECK (rating >= 1 AND rating <= 5)
);