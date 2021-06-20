DROP DATABASE IF EXISTS tracker_DB;
CREATE DATABASE tracker_DB;
USE tracker_DB;

CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL
);

CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL,
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
    manager_id INT,
    FOREIGN KEY (role_id) REFERENCES role(id),
    FOREIGN KEY (manager_id) REFERENCES employee(id)
);

INSERT INTO department (name)
Values ('Finance'), ('Sales'), ('Human Resources'), ('Operations');

Insert INTO role (title, salary, department_id)
VALUES ('Financial Analyst', 70000, 1), ('Salesperson', 65000, 2), ('Benefits Specialist', 55000, 3),
('Logistics Specialist', 70000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Bob', 'Smith', 1, 1), ('Andrew', 'Luck', 2, 2), ('Peyton', 'Manning', 3, 3), ('Marvin', 'Harrison', 4, 4);


SELECT * FROM tracker_db.department;
SELECT * FROM tracker_db.role;
SELECT * FROM tracker_db.employee;