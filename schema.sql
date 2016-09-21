CREATE DATABASE bamazon;
USE bamazon;

create table products (
	item_id MEDIUMINT NOT NULL AUTO_INCREMENT, 
    product_name VARCHAR(30) NOT NULL,
    dept_name VARCHAR(30),
    product_price DECIMAL(8,2) NOT NULL,
    qty INT,
    PRIMARY	KEY (item_id));
    
INSERT INTO products (product_name, dept_name, product_price, qty) VALUES
    ('carrot','roots',3.00,50),
    ('potato','roots',6.00,34),
    ('celery','greens',1.00,12),
    ('lettuce','greens',2.00,65),
    ('scallion','greens',3.50,12),
    ('blackberry pie','pies',12.00,74),
    ('blueberry pie','pies',5.00,23),
    ('strawberry pie','pies',7.00,36);