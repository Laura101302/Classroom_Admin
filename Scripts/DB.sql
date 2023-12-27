-- CREATE DATABASE IF NOT EXISTS
CREATE DATABASE IF NOT EXISTS CLASSROOM_ADMIN;

-- USE DATABASE
USE CLASSROOM_ADMIN;

-- TABLE CENTER
CREATE TABLE CENTER(
  cif VARCHAR(9) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  direction VARCHAR(255) NOT NULL,
  postal_code INT(5) NOT NULL,
  city VARCHAR(100) NOT NULL,
  province VARCHAR(100) NOT NULL
);

-- TABLE ROLE
CREATE TABLE ROLE(
  id INT PRIMARY KEY,
  name VARCHAR(50) NOT NULL
);

-- TABLE TEACHER
CREATE TABLE TEACHER(
  dni VARCHAR(9) PRIMARY KEY,
  pass VARCHAR(255) NOT NULL,
  name VARCHAR(50) NOT NULL,
  surnames VARCHAR(100),
  phone VARCHAR(20),
  email VARCHAR(100) NOT NULL UNIQUE,
  birthdate DATE,
  cif_center VARCHAR(9),
  id_role INT,
  CONSTRAINT teacher_cif_center_fk FOREIGN KEY (cif_center) REFERENCES CENTER(cif) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT teacher_id_role_fk FOREIGN KEY (id_role) REFERENCES ROLE(id) ON UPDATE CASCADE ON DELETE CASCADE
);

-- TABLE ROOM TYPE
CREATE TABLE ROOM_TYPE(
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50)
);

-- TABLE ROOM
CREATE TABLE ROOM(
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50),
  seats_number INT(2),
  floor_number INT(2),
  room_type_id INT,
  center_cif VARCHAR(9) NOT NULL,
  CONSTRAINT room_room_type_id_fk FOREIGN KEY (room_type_id) REFERENCES ROOM_TYPE(id) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT room_center_cif_fk FOREIGN KEY (center_cif) REFERENCES CENTER(cif) ON UPDATE CASCADE ON DELETE CASCADE
);

-- TABLE SEAT
CREATE TABLE SEAT(
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50),
  id_room INT,
  CONSTRAINT seat_id_room_fk FOREIGN KEY (id_room) REFERENCES ROOM(id) ON UPDATE CASCADE ON DELETE CASCADE
);
