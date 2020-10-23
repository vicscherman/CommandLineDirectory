CREATE database employeeManager;

USE employeeManager;



DROP TABLE IF EXISTS `department`;
CREATE TABLE `department`(
`id` INTEGER AUTO_INCREMENT PRIMARY KEY,
`name` VARCHAR (30)
);

DROP TABLE IF EXISTS `role`;
CREATE TABLE `role`(
`id` INTEGER AUTO_INCREMENT PRIMARY KEY,
`department_id` INTEGER,
`title` VARCHAR (30),
`salary` DECIMAL,
FOREIGN KEY (department_id) REFERENCES department(id)
ON DELETE CASCADE
);

DROP TABLE IF EXISTS `employee`;
CREATE TABLE `employee`(
`id` INTEGER AUTO_INCREMENT PRIMARY KEY,
`role_id` INTEGER,
`first_name` VARCHAR (30),
`last_name` VARCHAR (30),
`manager_id` INTEGER,
FOREIGN KEY (role_id) REFERENCES `role`(id)
ON DELETE CASCADE

);


