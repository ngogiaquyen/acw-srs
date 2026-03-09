-- Add 'add_time' to device_commands.command_type ENUM
ALTER TABLE device_commands
  MODIFY COLUMN command_type ENUM('start', 'stop', 'add_time', 'restart', 'update_firmware', 'config') NOT NULL;
