-- ============================================================
-- AI Moderation Dashboard & Audit Module — Database Schema
-- Run this once against your MySQL database before starting
-- the backend server.
-- ============================================================

CREATE DATABASE IF NOT EXISTS cms_moderation;
USE cms_moderation;

-- Content submitted to the CMS that needs to pass through moderation
CREATE TABLE IF NOT EXISTS content_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  author VARCHAR(255) NOT NULL,
  content_type VARCHAR(50) DEFAULT 'post',      -- post, comment, article, etc.
  status ENUM('pending', 'approved', 'rejected', 'flagged') DEFAULT 'pending',
  risk_score INT DEFAULT 0,                     -- 0-100, higher = riskier (from AI scoring service)
  risk_reasons TEXT,                            -- JSON array of reasons the AI flagged it
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Admin/moderator users who take actions in the dashboard
CREATE TABLE IF NOT EXISTS moderators (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(50) DEFAULT 'moderator'          -- moderator, admin
);

-- Immutable audit trail — every moderation action gets logged here automatically
CREATE TABLE IF NOT EXISTS audit_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  moderator_id INT,
  moderator_name VARCHAR(255),
  action VARCHAR(100) NOT NULL,                 -- e.g. 'approve', 'reject', 'flag', 'rescan'
  target_type VARCHAR(50) NOT NULL,              -- e.g. 'content_item'
  target_id INT NOT NULL,
  details TEXT,                                  -- JSON blob with extra context (old status, new status, notes)
  ip_address VARCHAR(64),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (moderator_id) REFERENCES moderators(id) ON DELETE SET NULL
);

-- A couple of sample moderators so the dashboard has something to show immediately
INSERT INTO moderators (name, email, role) VALUES
  ('Safrin', 'safrin@example.com', 'admin'),
  ('Demo Moderator', 'demo@example.com', 'moderator')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- A few sample content items covering clean, spammy, and risky text so the
-- AI scoring service has something interesting to score on first run.
INSERT INTO content_items (title, body, author, content_type) VALUES
  ('Welcome to our community', 'Excited to be here and share ideas with everyone!', 'jane_doe', 'post'),
  ('CLICK HERE NOW!!!', 'Buy cheap followers fast!!! Visit http://spam-link.example.com http://another-spam.example.com now!!!', 'spammer99', 'comment'),
  ('Product feedback', 'I really dislike how slow the checkout page is, please fix it.', 'user123', 'comment');
