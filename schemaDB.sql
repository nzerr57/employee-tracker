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
    salary DECIMAL NOT NULL,
    department_id INT
    -- FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT
    -- FOREIGN KEY (role_id) REFERENCES role(id),
    -- FOREIGN KEY (manager_id) REFERENCES employee(id)
);

INSERT INTO department (name)
Values ('Finance'), ('Sales'), ('Human Resources'), ('Operations');

Insert INTO role (title, salary, department_id)
VALUES ('VP of Finance', 200000, 1), ('VP of Operations', 175000, 2), ('Benefits Specialist', 55000, 3),
('Logistics Specialist', 70000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Peyton', 'Manning', 1, null), ('Andrew', 'Luck', 2, null), ('Quenton', 'Nelson', 3, 1), ('Marvin', 'Harrison', 4, 2);


SELECT * FROM tracker_db.department;
SELECT * FROM tracker_db.role;
SELECT * FROM tracker_db.employee;