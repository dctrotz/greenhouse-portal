# Greenhouse Portal Service Installation

## Prerequisites

1. Node.js 18+ installed on Debian 12
2. Project built and dependencies installed (`npm install && npm run build`)
3. Environment variables configured (or update the service file)

## Installation Steps

1. **Copy the service file to systemd directory:**
   ```bash
   sudo cp deployment/greenhouse-portal.service /etc/systemd/system/
   ```

2. **Edit the service file to match your setup:**
   ```bash
   sudo nano /etc/systemd/system/greenhouse-portal.service
   ```
   
   Update the following variables:
   - `User`: Change from `pi` to your actual username
   - `WorkingDirectory`: Update to your actual project path
   - `ExecStart`: Update the path to match your project location
   - `DB_PATH`: Update if your database is in a different location
   - `IMAGE_BASE_DIR`: Update if your images are stored elsewhere
   - `PORT`: Change if you want a different port

3. **Reload systemd to recognize the new service:**
   ```bash
   sudo systemctl daemon-reload
   ```

4. **Enable the service to start on boot:**
   ```bash
   sudo systemctl enable greenhouse-portal.service
   ```

5. **Start the service:**
   ```bash
   sudo systemctl start greenhouse-portal.service
   ```

6. **Check the service status:**
   ```bash
   sudo systemctl status greenhouse-portal.service
   ```

## Useful Commands

- **View logs:**
  ```bash
  sudo journalctl -u greenhouse-portal.service -f
  ```

- **Stop the service:**
  ```bash
  sudo systemctl stop greenhouse-portal.service
  ```

- **Restart the service:**
  ```bash
  sudo systemctl restart greenhouse-portal.service
  ```

- **Disable auto-start on boot:**
  ```bash
  sudo systemctl disable greenhouse-portal.service
  ```

## Troubleshooting

- If the service fails to start, check the logs: `sudo journalctl -u greenhouse-portal.service -n 50`
- Ensure Node.js is installed and accessible: `which node`
- Verify file permissions on the project directory and database file
- Make sure the user specified in the service file has read/write access to required directories

