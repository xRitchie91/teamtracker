 //-----

 CREATE TABLE employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    last_name VARCHAR(30) NOT NULL,
    first_name VARCHAR(30) NOT NULL,
    department VARCHAR(40) NOT NULL,
    role VARCHAR(30) NOT NULL,
    manager VARCHAR(30),
    salary INT
    ); 