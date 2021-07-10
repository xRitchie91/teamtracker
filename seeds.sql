INSERT INTO departments (dept_name)
VALUES
('Pharmacy'),
('Grocery'),
('Beauty'),
('Garden'),
('Deli'),
('Sports');

INSERT INTO roles (title,salary,dept_id)
VALUES
('Director', 60000, 5),
('General Manager',55000, 5),
('Assistant Manager',50000, 1),
('Grocery Manager',45000, 2),
('Deli Manager',45000, 3),
('Outdoor Manager',45000, 4),
('Cashier', 25000, 5),
('Sports Assoc', 1000, NULL);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
('Shane','Doan',1,1),
('Shea','Theodore',2,2),
('Will','Karlsson',7,5),
('Derrick', 'Henry',7,10),
('Julio', 'Jones',4,5),
('AJ', 'Brown',7,12),
('Ryan', 'Tannehill',3,7),
('Jonathan', 'Marchessault',7,12),
('Ryan', 'Reaves',7,11),
('Nick', 'Roy',4,10),
('Kevin', 'Byard',5,1),
('Jayon', 'Brown',6,12),
('Will','Compton',7,10),
('Taylor', 'Lewan',7,5),
('Patrice','Bergeron',7,5),
('Andy','Kopitar',7,1);
