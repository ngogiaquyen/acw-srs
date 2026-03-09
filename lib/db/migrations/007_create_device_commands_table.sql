-- Create device_commands table
CREATE TABLE IF NOT EXISTS device_commands (
  id INT PRIMARY KEY AUTO_INCREMENT,
  device_id INT NOT NULL,
  command_type ENUM('start', 'stop', 'add_time', 'restart', 'update_firmware', 'config') NOT NULL,
  command_data JSON NULL,
  status ENUM('pending', 'sent', 'executed', 'failed') DEFAULT 'pending',
  response_data JSON NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  executed_at TIMESTAMP NULL,
  FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE CASCADE,
  INDEX idx_device_status_created (device_id, status, created_at)
);
