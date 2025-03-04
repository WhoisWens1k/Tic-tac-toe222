# Kill any existing Node.js processes (ignore errors if none are found)
taskkill /f /im node.exe 2>$null

# Start the React application
npm start

# Wait a moment for the server to start
Start-Sleep -Seconds 3

# Open the browser to the application URL
Start-Process "http://localhost:3000" 