# ComfyUI Studio

A professional web-based frontend for ComfyUI with integrated Civitai model browsing. This application uses a React/TypeScript frontend with a Python Flask backend to bypass browser security restrictions and enable seamless communication with ComfyUI.

## Architecture

- **Frontend**: React + TypeScript + Tailwind CSS (runs in browser)
- **Backend**: Python + Flask (proxies requests to ComfyUI and Civitai)
- **ComfyUI**: AI image generation engine (separate installation required)

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.8+
- ComfyUI installed with models

### 1. Start ComfyUI
```bash
cd /path/to/ComfyUI
python main.py
```

### 2. Start Backend (in a new terminal)
```bash
cd backend
pip install -r requirements.txt
python server.py
```

Or use the convenience scripts:
- **Linux/Mac**: `./start.sh`
- **Windows**: `start.bat`

### 3. Start Frontend (in another terminal)
```bash
npm install
npm run dev
```

Open your browser to the URL shown (usually `http://localhost:5173`)

## Features

- 🎨 **AI Image Generation**: Generate images using ComfyUI workflows
- 🔧 **Model Management**: Select GGUF models and LoRAs with adjustable strength
- 🔍 **Civitai Integration**: Search and browse models from Civitai
- 📊 **Real-time Progress**: WebSocket-based generation status updates
- 🖼️ **Gallery View**: View all generated images in an organized gallery
- ⚡ **Fast & Responsive**: Modern UI with smooth animations

## Detailed Setup

See [SETUP.md](SETUP.md) for comprehensive setup instructions, troubleshooting, and configuration options.

## Backend Documentation

See [backend/README.md](backend/README.md) for backend-specific documentation and API reference.

## Project Structure

```
spark-template/
├── backend/              # Python Flask backend
│   ├── server.py        # Main server file
│   ├── requirements.txt # Python dependencies
│   ├── start.sh        # Linux/Mac startup script
│   ├── start.bat       # Windows startup script
│   └── README.md        # Backend docs
├── src/
│   ├── components/      # React components
│   ├── lib/            # API clients and utilities
│   └── App.tsx         # Main application
└── SETUP.md            # Complete setup guide
```

## Why a Backend?

Browsers cannot directly connect to local servers like ComfyUI due to CORS (Cross-Origin Resource Sharing) security policies. The Python backend acts as a secure bridge, allowing the frontend to communicate with ComfyUI and Civitai APIs without security restrictions.

## Development

Frontend with hot reload:
```bash
npm run dev
```

Backend with auto-reload (debug mode is enabled by default):
```bash
cd backend
python server.py
```

## Building for Production

```bash
npm run build
```

The optimized files will be in the `dist/` directory.

## Troubleshooting

**"Backend server not running"**
- Make sure you started the backend: `python backend/server.py`
- Check that it's running on port 5000

**"Cannot connect to ComfyUI"**
- Verify ComfyUI is running at `http://127.0.0.1:8188`
- Check the backend console for connection errors

See [SETUP.md](SETUP.md) for more troubleshooting help.

## License

The Spark Template files and resources from GitHub are licensed under the terms of the MIT license, Copyright GitHub, Inc.
