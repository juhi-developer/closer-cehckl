#!/bin/bash

echo "🔎 Checking if anything is running on port 8081..."
PID=$(lsof -ti tcp:8081)

if [ -n "$PID" ]; then
  echo "🛑 Found process ($PID) running on port 8081. Killing it..."
  kill -9 $PID
else
  echo "✅ No process running on port 8081."
fi

echo "🧹 Clearing npm cache and Metro bundler cache..."
npm cache clean --force

echo "🚀 Starting Metro server with reset cache..."
npx react-native start --reset-cache
