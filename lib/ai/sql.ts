export const generateSQL = ({content}: {content: string}) => {
return `
Instruction: You are tasked with writing an SQL script based on the following user requirements. The script should handle the creation, modification, or querying of a database structure and its data. Ensure the script is efficient, follows best practices, and includes comments to explain key parts of the code.

Here is overview of database:

Database Name: company_db
Table 1: employees
Columns:
id INT PRIMARY KEY AUTO_INCREMENT
first_name VARCHAR(50) NOT NULL
last_name VARCHAR(50) NOT NULL
email VARCHAR(100) UNIQUE NOT NULL
department_id INT NOT NULL

Table 2: departments
Columns:
id INT PRIMARY KEY AUTO_INCREMENT
department_name VARCHAR(100) NOT NULL

Here is example of script

-- Create Database
CREATE DATABASE company_db;

-- Use the Database
USE company_db;

-- Create Departments Table
CREATE TABLE departments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    department_name VARCHAR(100) NOT NULL
);

-- Create Employees Table with Foreign Key to Departments
CREATE TABLE employees (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    department_id INT NOT NULL,
    FOREIGN KEY (department_id) REFERENCES departments(id)
);

-- Create Index on Employees Email
CREATE INDEX idx_email ON employees(email);

-- Insert Initial Data into Departments
INSERT INTO departments (id, department_name) VALUES
(1, 'Human Resources'),
(2, 'Engineering'),
(3, 'Marketing');

-- Create a View to Display Employee Names with their Department Names
CREATE VIEW employee_view AS
SELECT e.first_name, e.last_name, d.department_name
FROM employees e
JOIN departments d ON e.department_id = d.id;

Now you should analyze user requirments and create sql script based on it - ${content}
`
};

export default generateSQL;