#!/bin/bash

echo "🚀 Starting ComfyUI Studio Backend Server"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "server.py" ]; then
    echo "❌ Error: server.py not found. Please run this script from the backend/ directory."
    exit 1
fi

# Check if requirements are installed
echo "📦 Checking dependencies..."
if ! python3 -c "import flask" 2>/dev/null; then
    echo "📥 Installing dependencies..."
    pip install -r requirements.txt
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies. Please run manually:"
        echo "   pip install -r requirements.txt"
        exit 1
    fi
else
    echo "✅ Dependencies already installed"
fi

echo ""
echo "✨ Starting server..."
echo ""
python3 server.py
