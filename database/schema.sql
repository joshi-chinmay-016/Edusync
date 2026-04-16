-- ============================================================
--  EduSync Database Schema
--  Run this file BEFORE seed.sql to set up the database.
-- ============================================================

CREATE DATABASE IF NOT EXISTS edusync
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE edusync;

-- ------------------------------------------------------------
-- Users
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS Users (
    id          INT             AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100)    NOT NULL,
    email       VARCHAR(100)    NOT NULL UNIQUE,
    password    VARCHAR(255)    NOT NULL,
    role        ENUM('Admin', 'Faculty', 'Student') NOT NULL,
    created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_users_email (email)
);

-- ------------------------------------------------------------
-- Classrooms
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS Classrooms (
    id          INT             AUTO_INCREMENT PRIMARY KEY,
    room_name   VARCHAR(100)    NOT NULL UNIQUE,
    capacity    INT             NOT NULL,
    building    VARCHAR(100)    NOT NULL,
    created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_classrooms_room_name (room_name)
);

-- ------------------------------------------------------------
-- Resources  (belongs to a Classroom)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS Resources (
    id              INT             AUTO_INCREMENT PRIMARY KEY,
    classroom_id    INT             NOT NULL,
    resource_name   VARCHAR(100)    NOT NULL,
    CONSTRAINT fk_resources_classroom
        FOREIGN KEY (classroom_id) REFERENCES Classrooms (id)
        ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- Bookings
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS Bookings (
    id              INT         AUTO_INCREMENT PRIMARY KEY,
    user_id         INT         NOT NULL,
    classroom_id    INT         NOT NULL,
    start_time      DATETIME    NOT NULL,
    end_time        DATETIME    NOT NULL,
    status          ENUM('Confirmed', 'Cancelled', 'Completed') NOT NULL DEFAULT 'Confirmed',
    CONSTRAINT fk_bookings_user
        FOREIGN KEY (user_id)      REFERENCES Users      (id) ON DELETE CASCADE,
    CONSTRAINT fk_bookings_classroom
        FOREIGN KEY (classroom_id) REFERENCES Classrooms (id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- UsageLogs
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS UsageLogs (
    id              INT             AUTO_INCREMENT PRIMARY KEY,
    classroom_id    INT             NOT NULL,
    user_id         INT             NOT NULL,
    action          VARCHAR(100)    NOT NULL,
    usage_date      DATETIME        NOT NULL,
    CONSTRAINT fk_usagelogs_classroom
        FOREIGN KEY (classroom_id) REFERENCES Classrooms (id) ON DELETE CASCADE,
    CONSTRAINT fk_usagelogs_user
        FOREIGN KEY (user_id)      REFERENCES Users     (id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- AuthLogs
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS AuthLogs (
    id          INT             AUTO_INCREMENT PRIMARY KEY,
    user_id     INT             NOT NULL,
    action      VARCHAR(50)     NOT NULL,
    timestamp   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_authlogs_user
        FOREIGN KEY (user_id) REFERENCES Users (id) ON DELETE CASCADE
);
