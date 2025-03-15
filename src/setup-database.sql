-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS jovixai_db;

-- Use the database
USE jovixai_db;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'editor', 'user') DEFAULT 'user',
  profile_image VARCHAR(255) DEFAULT '/images/default-avatar.png',
  bio TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  excerpt TEXT,
  content LONGTEXT,
  author_id INT,
  category VARCHAR(100),
  image_url VARCHAR(255),
  status ENUM('draft', 'published') DEFAULT 'draft',
  published_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(50),
  features JSON,
  use_cases JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create portfolio_items table
CREATE TABLE IF NOT EXISTS portfolio_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  full_description TEXT,
  client VARCHAR(255),
  image_url VARCHAR(255),
  tags JSON,
  category VARCHAR(100),
  results JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create user_sessions table for authentication
CREATE TABLE IF NOT EXISTS user_sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  session_token VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create user_activity_log table
CREATE TABLE IF NOT EXISTS user_activity_log (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  action VARCHAR(100) NOT NULL,
  details TEXT,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Create oauth_accounts table for social logins
CREATE TABLE IF NOT EXISTS oauth_accounts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  provider VARCHAR(50) NOT NULL,
  provider_user_id VARCHAR(255) NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  expires_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY provider_user_id_unique (provider, provider_user_id)
);

-- Insert admin user (password is 'admin123' - in SHA256 hash)
INSERT INTO users (name, email, password, role, profile_image, bio) 
VALUES (
  'Admin User', 
  'admin@jovixai.com', 
  '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', -- SHA256 hash of 'admin123'
  'admin',
  '/images/default-avatar.png',
  'System administrator'
);

-- Insert some sample blog posts
INSERT INTO blog_posts (title, slug, excerpt, content, author_id, category, image_url, status, published_at) VALUES
('Advancements in Object Detection Technology', 'advancements-in-object-detection', 'Exploring the latest breakthroughs in AI-powered object detection and their real-world applications.', 'This is a sample blog post content about object detection technology.', 1, 'Technology', '/placeholder.svg?height=600&width=1200', 'published', NOW()),
('The Evolution of Text-to-Speech Models', 'evolution-of-text-to-speech', 'How modern TTS systems are revolutionizing accessibility and content consumption.', 'This is a sample blog post content about text-to-speech technology.', 1, 'AI Research', '/placeholder.svg?height=600&width=1200', 'published', NOW()),
('Implementing AI in Enterprise Solutions', 'implementing-ai-enterprise-solutions', 'A guide to successfully integrating AI technologies into your business operations.', 'This is a sample blog post content about AI in enterprise.', 1, 'Business', '/placeholder.svg?height=600&width=1200', 'published', NOW());

-- Insert sample services
INSERT INTO services (title, slug, description, icon, features, use_cases) VALUES
('Object Detection Models', 'object-detection', 'Advanced AI models that can identify and track objects in images and video streams with high accuracy.', 'Eye', '["Real-time detection", "Multi-object tracking", "High accuracy"]', '["Retail security", "Traffic monitoring", "Manufacturing QA"]'),
('Text-to-Speech Solutions', 'text-to-speech', 'Natural-sounding voice synthesis technology that converts written text into lifelike speech.', 'Mic', '["Natural voice", "Multiple languages", "Customizable voices"]', '["Audiobooks", "Accessibility", "Virtual assistants"]'),
('Custom AI Integration', 'custom-integration', 'Tailored AI solutions integrated seamlessly into your existing systems and workflows.', 'Cpu', '["Seamless integration", "Custom development", "Scalable solutions"]', '["Enterprise systems", "Healthcare", "Financial services"]');

-- Insert sample portfolio items
INSERT INTO portfolio_items (title, description, full_description, client, image_url, tags, category, results) VALUES
('Retail Security System', 'AI-powered object detection for retail security and inventory management.', 'A comprehensive security system for retail environments that uses object detection to identify suspicious behavior, prevent theft, and track inventory in real-time.', 'Major Retail Chain', '/placeholder.svg?height=400&width=600', '["Object Detection", "Retail", "Security"]', 'object-detection', '["30% reduction in inventory shrinkage", "Improved staff allocation efficiency", "Real-time alerts for security incidents"]'),
('Audiobook Production Suite', 'Text-to-speech platform for publishers creating high-quality audiobooks.', 'A complete audiobook production platform that converts manuscripts into natural-sounding narration, reducing production costs and time-to-market for publishers.', 'Publishing House Consortium', '/placeholder.svg?height=400&width=600', '["Text-to-Speech", "Publishing", "Audio"]', 'text-to-speech', '["90% reduction in production costs", "8x faster time-to-market", "Expanded audiobook catalog by 300%"]'),
('Traffic Monitoring System', 'Real-time object detection for smart city traffic management.', 'An intelligent traffic monitoring system that uses object detection to analyze traffic patterns, detect incidents, and optimize signal timing for improved urban mobility.', 'Metropolitan Transportation Authority', '/placeholder.svg?height=400&width=600', '["Object Detection", "Smart City", "Real-time"]', 'object-detection', '["25% reduction in average commute times", "40% decrease in traffic congestion", "Faster emergency response coordination"]');

