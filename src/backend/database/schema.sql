-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS workout_tracker;
USE workout_tracker;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create workouts table
CREATE TABLE IF NOT EXISTS workouts (
    id BIGINT PRIMARY KEY,
    user_id VARCHAR(255),
    name VARCHAR(255) NOT NULL,
    duration VARCHAR(50),
    last_completed TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create exercises table
CREATE TABLE IF NOT EXISTS exercises (
    id BIGINT PRIMARY KEY,
    workout_id BIGINT,
    name VARCHAR(255) NOT NULL,
    sets INT NOT NULL,
    FOREIGN KEY (workout_id) REFERENCES workouts(id) ON DELETE CASCADE
);

-- Create workout_logs table
CREATE TABLE IF NOT EXISTS workout_logs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    workout_id BIGINT,
    user_id VARCHAR(255),
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (workout_id) REFERENCES workouts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create exercise_sets table
CREATE TABLE IF NOT EXISTS exercise_sets (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    workout_log_id BIGINT,
    exercise_id BIGINT,
    set_number INT NOT NULL,
    reps INT,
    weight DECIMAL(5,2),
    FOREIGN KEY (workout_log_id) REFERENCES workout_logs(id) ON DELETE CASCADE,
    FOREIGN KEY (exercise_id) REFERENCES exercises(id)
); 