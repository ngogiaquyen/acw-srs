-- Create device_logs table
CREATE TABLE IF NOT EXISTS device_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  device_id INT NOT NULL,
  log_level ENUM('info', 'warning', 'error') DEFAULT 'info',
  message TEXT NOT NULL,
  metadata JSON NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE CASCADE,
  INDEX idx_device_created (device_id, created_at)
);
