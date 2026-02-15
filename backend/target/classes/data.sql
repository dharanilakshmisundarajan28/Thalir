INSERT IGNORE INTO roles(name) VALUES('ROLE_FARMER');
INSERT IGNORE INTO roles(name) VALUES('ROLE_CONSUMER');
INSERT IGNORE INTO roles(name) VALUES('ROLE_PROVIDER');
INSERT IGNORE INTO roles(name) VALUES('ROLE_ADMIN');

-- Password for all users is "password123"
-- BCrypt Hash: $2a$10$slYQmyNdGzTn7ZLBXBChFOC9f6kFjAqPhccnP6DzlWXFx82EW51u2

-- 1. Admin User
INSERT IGNORE INTO users(username, email, password) VALUES('admin', 'admin@thalir.com', '$2a$10$slYQmyNdGzTn7ZLBXBChFOC9f6kFjAqPhccnP6DzlWXFx82EW51u2');
INSERT IGNORE INTO user_roles(user_id, role_id) SELECT u.id, r.id FROM users u, roles r WHERE u.username='admin' AND r.name='ROLE_ADMIN';

-- 2. Farmer User
INSERT IGNORE INTO users(username, email, password) VALUES('farmer', 'farmer@thalir.com', '$2a$10$slYQmyNdGzTn7ZLBXBChFOC9f6kFjAqPhccnP6DzlWXFx82EW51u2');
INSERT IGNORE INTO user_roles(user_id, role_id) SELECT u.id, r.id FROM users u, roles r WHERE u.username='farmer' AND r.name='ROLE_FARMER';

-- 3. Consumer User
INSERT IGNORE INTO users(username, email, password) VALUES('consumer', 'consumer@thalir.com', '$2a$10$slYQmyNdGzTn7ZLBXBChFOC9f6kFjAqPhccnP6DzlWXFx82EW51u2');
INSERT IGNORE INTO user_roles(user_id, role_id) SELECT u.id, r.id FROM users u, roles r WHERE u.username='consumer' AND r.name='ROLE_CONSUMER';

-- 4. Provider User
INSERT IGNORE INTO users(username, email, password) VALUES('provider', 'provider@thalir.com', '$2a$10$slYQmyNdGzTn7ZLBXBChFOC9f6kFjAqPhccnP6DzlWXFx82EW51u2');
INSERT IGNORE INTO user_roles(user_id, role_id) SELECT u.id, r.id FROM users u, roles r WHERE u.username='provider' AND r.name='ROLE_PROVIDER';

