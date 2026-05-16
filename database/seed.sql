USE edusync;

-- Seed Users (Passwords are 'password123' generated with bcrypt)
-- You can generate new bcrypt hashes in python if needed. This is a standard valid bcrypt hash for 'password123'.
INSERT INTO Users (name, email, password, role) VALUES
('System Admin', 'admin@edusync.local', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'Admin'),
('Dr. Emily Chen', 'emily.chen@edusync.local', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'Faculty'),
('Prof. Alan Turing', 'alan.turing@edusync.local', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'Faculty'),
('John Doe', 'john.doe@edusync.local', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'Student');

-- Seed Classrooms
INSERT INTO Classrooms (room_name, capacity, building) VALUES
('Room 101', 60, 'Science Building'),
('Room 102', 40, 'Science Building'),
('Room 201', 120, 'Main Auditorium Block'),
('Room 303', 30, 'Arts & Humanities'),
('Room 404', 50, 'Engineering Complex');

-- Seed Resources
INSERT INTO Resources (classroom_id, resource_name) VALUES
(1, 'Projector'),
(1, 'Whiteboard'),
(1, 'Microphone'),
(2, 'Projector'),
(3, 'Smart Board'),
(3, 'Surround Sound System'),
(3, 'Podium Microphone'),
(4, 'Chalkboard'),
(5, 'Projector'),
(5, '30 Desktop Computers');

-- Seed Bookings
-- Generating some historical bookings to feed the AI Analytics module
INSERT INTO Bookings (user_id, classroom_id, start_time, end_time, status) VALUES
(2, 1, DATE_SUB(NOW(), INTERVAL 5 DAY) + INTERVAL 10 HOUR, DATE_SUB(NOW(), INTERVAL 5 DAY) + INTERVAL 12 HOUR, 'Completed'),
(3, 1, DATE_SUB(NOW(), INTERVAL 4 DAY) + INTERVAL 10 HOUR, DATE_SUB(NOW(), INTERVAL 4 DAY) + INTERVAL 12 HOUR, 'Completed'),
(2, 2, DATE_SUB(NOW(), INTERVAL 3 DAY) + INTERVAL 14 HOUR, DATE_SUB(NOW(), INTERVAL 3 DAY) + INTERVAL 16 HOUR, 'Completed'),
(3, 3, DATE_SUB(NOW(), INTERVAL 2 DAY) + INTERVAL 9 HOUR, DATE_SUB(NOW(), INTERVAL 2 DAY) + INTERVAL 11 HOUR, 'Completed'),
(2, 5, DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 13 HOUR, DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 15 HOUR, 'Completed'),
(3, 1, DATE_ADD(NOW(), INTERVAL 1 DAY) + INTERVAL 10 HOUR, DATE_ADD(NOW(), INTERVAL 1 DAY) + INTERVAL 12 HOUR, 'Confirmed');

-- Seed Usage Logs
INSERT INTO UsageLogs (classroom_id, user_id, action, usage_date) VALUES
(1, 2, 'BOOKED', DATE_SUB(NOW(), INTERVAL 8 DAY)),
(1, 3, 'BOOKED', DATE_SUB(NOW(), INTERVAL 7 DAY)),
(2, 2, 'BOOKED', DATE_SUB(NOW(), INTERVAL 6 DAY)),
(3, 3, 'BOOKED', DATE_SUB(NOW(), INTERVAL 5 DAY)),
(5, 2, 'BOOKED', DATE_SUB(NOW(), INTERVAL 4 DAY)),
(1, 3, 'BOOKED', NOW());
