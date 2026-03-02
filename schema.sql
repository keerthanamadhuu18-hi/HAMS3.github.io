CREATE DATABASE IF NOT EXISTS hams_db;
USE hams_db;

-- -----------------------------------------------------
-- Table: departments
-- -----------------------------------------------------
CREATE TABLE departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- -----------------------------------------------------
-- Table: users
-- Represents Admins, Doctors, and Patients
-- -----------------------------------------------------
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'DOCTOR', 'PATIENT') NOT NULL,
    username VARCHAR(150) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    
    -- Doctor specific fields (nullable for other roles)
    department_id INT DEFAULT NULL,
    degree VARCHAR(100) DEFAULT NULL,
    experience INT DEFAULT 0,
    fees DECIMAL(10, 2) DEFAULT 0.00,
    
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
);

-- -----------------------------------------------------
-- Table: appointments
-- -----------------------------------------------------
CREATE TABLE appointments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    doctor_id INT NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    problem TEXT,
    patient_name VARCHAR(255),
    age VARCHAR(50),
    phone VARCHAR(50),
    address TEXT,
    medical_background TEXT,
    status ENUM('SCHEDULED', 'CANCELLED') DEFAULT 'SCHEDULED',
    
    FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES users(id) ON DELETE CASCADE
);

-- -----------------------------------------------------
-- Initial Seed Data (Matching db.js state)
-- -----------------------------------------------------
INSERT INTO departments (id, name) VALUES 
(1, 'Cardiology'), 
(2, 'Pediatrics');

INSERT INTO users (id, name, role, username, email, password, department_id, degree) VALUES 
(1, 'Super Admin', 'ADMIN', 'admin', 'admin@hams.com', 'password', NULL, NULL),
(2, 'Dr. John Smith', 'DOCTOR', 'john', 'john@hams.com', 'password', 1, 'MD'),
(3, 'Jane Doe', 'PATIENT', 'jane', 'jane@hams.com', 'password', NULL, NULL);
