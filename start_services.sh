#!/bin/bash
# start_services.sh
cd /Users/kuangxb/Desktop/CompanySite
lsof -ti:3000,4000 | xargs kill -9 2>/dev/null || true
echo "Starting Backend..."
nohup node server/index.js > backend_persistent.log 2>&1 &
echo "Starting Frontend..."
nohup npm run dev -- --port 4000 --host 127.0.0.1 > vite_persistent.log 2>&1 &
sleep 5
echo "Service Status:"
lsof -i :3000
lsof -i :4000
