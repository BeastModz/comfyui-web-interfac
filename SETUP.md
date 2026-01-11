# ComfyUI Studio - Complete Setup Guide

This project consists of two parts:
1. **Frontend**: React/TypeScript web interface (runs in browser)
2. **Backend**: Python Flask server (proxies requests to ComfyUI and Civitai)

## Why Two Parts?

Browsers cannot directly connect to local servers like ComfyUI due to CORS (Cross-Origin Resource Sharing) security restrictions. The Python backend acts as a bridge, allowing the browser frontend to communicate with ComfyUI safely.

## Prerequisites

- **Node.js 18+** (for frontend)
- **Python 3.8+** (for backend)
- **ComfyUI** installed and configured with models
- Modern web browser (Chrome, Firefox, Edge, etc.)

## Quick Start

### 1. Start ComfyUI

First, make sure ComfyUI is running:

```bash
cd /path/to/ComfyUI
python main.py
```

ComfyUI should be accessible at `http://127.0.0.1:8188`

### 2. Start the Python Backend

Open a new terminal:

```bash
cd /path/to/spark-template/backend
pip install -r requirements.txt
python server.py
```

You should see:
```
🚀 Starting ComfyUI Studio Backend
📡 ComfyUI Server: 127.0.0.1:8188
🌐 Backend running on http://localhost:5000
✅ Ready to accept requests!
```

### 3. Start the Frontend

Open another terminal:

```bash
cd /path/to/spark-template
npm install  # Only needed first time
npm run dev
```

The frontend will open in your browser (usually `http://localhost:5173`)

## Architecture Overview

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   Browser   │ ──────> │   Python    │ ──────> │   ComfyUI   │
│  (Frontend) │ <────── │  (Backend)  │ <────── │  (Server)   │
└─────────────┘         └─────────────┘         └─────────────┘
     React                   Flask              Image Generation
  Port: 5173              Port: 5000            Port: 8188

Browser also connects to:
└──────> Python Backend ──────> Civitai API
         (Proxies requests)     (Model Search)
```

## Features

### Generation Tab
- Select models (GGUF format)
- Choose LoRAs with adjustable strength
- Enter positive and negative prompts
- Real-time generation with progress updates
- View generated images in gallery

### Browse Tab
- Search Civitai for LoRAs and Checkpoints
- View model previews
- Download models directly
- Fallback to web browser for manual downloads

## Configuration

### Backend Configuration

Edit `backend/server.py` to change settings:

```python
COMFY_SERVER = "127.0.0.1:8188"  # Your ComfyUI address
```

To change the backend port:

```python
app.run(host='0.0.0.0', port=5000)  # Change port here
```

If you change the backend port, also update the frontend in `src/lib/comfyui-api.ts`:

```typescript
this.backendUrl = 'http://localhost:5000/api'  // Match your backend port
```

### Frontend Configuration

Edit `src/App.tsx` to change ComfyUI server:

```typescript
const COMFY_SERVER = '127.0.0.1:8188'  // Your ComfyUI address
```

## Troubleshooting

### "Backend server not running"

**Problem**: Frontend can't connect to Python backend

**Solutions**:
1. Make sure you started the backend: `python backend/server.py`
2. Check that it's running on port 5000
3. Look for error messages in the backend terminal
4. Try accessing `http://localhost:5000/api/health` in your browser

### "Cannot connect to ComfyUI"

**Problem**: Backend can't reach ComfyUI

**Solutions**:
1. Verify ComfyUI is running: `http://127.0.0.1:8188` should load in browser
2. Check the address in `backend/server.py` matches your ComfyUI installation
3. Look at ComfyUI console for errors
4. Make sure no firewall is blocking port 8188

### "No models found"

**Problem**: ComfyUI has no models installed

**Solutions**:
1. Download GGUF models and place in `ComfyUI/models/checkpoints/` or `ComfyUI/models/unet/`
2. Download LoRAs and place in `ComfyUI/models/loras/`
3. Restart ComfyUI after adding models
4. Click "Retry Connection" in the frontend

### Civitai Search Not Working

**Problem**: Search returns no results or errors

**Solutions**:
1. Verify backend is running (test with "Test Backend Connection" button)
2. Check your internet connection
3. Try searching without a query (browse popular models)
4. Use "Browse Civitai Website" to download models manually
5. Civitai may have rate limits - wait a few minutes and try again

### Images Not Displaying

**Problem**: Generated images don't show up

**Solutions**:
1. Check browser console for errors (F12)
2. Verify images were saved in ComfyUI's output folder
3. Make sure backend is proxying image requests correctly
4. Try refreshing the page

### CORS Errors Still Appearing

**Problem**: Browser showing CORS errors

**Solutions**:
1. Make sure you're using the backend, not connecting directly to ComfyUI
2. Verify the backend has `flask-cors` installed
3. Restart both frontend and backend servers
4. Clear browser cache and reload

## Development Notes

### Running in Development Mode

Frontend (with hot reload):
```bash
npm run dev
```

Backend (with auto-reload):
```bash
python server.py  # debug=True is already set
```

### Building for Production

Frontend:
```bash
npm run build
```

This creates optimized files in the `dist/` folder.

## File Structure

```
spark-template/
├── backend/
│   ├── server.py           # Python Flask backend
│   ├── requirements.txt    # Python dependencies
│   └── README.md          # Backend documentation
├── src/
│   ├── components/
│   │   ├── GenerateTab.tsx    # Generation interface
│   │   └── BrowseTab.tsx      # Model browsing
│   ├── lib/
│   │   ├── comfyui-api.ts     # API client
│   │   └── types.ts           # TypeScript types
│   ├── App.tsx                # Main app component
│   └── index.css              # Styles
├── index.html
├── package.json
└── README.md              # This file
```

## API Endpoints Reference

### Backend Endpoints

**Health Check**
```
GET /api/health
Returns: { "status": "ok", "server": "ComfyUI Studio Backend" }
```

**Get Models**
```
GET /api/comfy/models/{node_type}/{input_name}
Returns: { "models": ["model1.gguf", "model2.gguf", ...] }
```

**Queue Generation**
```
POST /api/comfy/queue
Body: { "workflow": {...}, "client_id": "..." }
Returns: { "prompt_id": "..." }
```

**Search Civitai**
```
GET /api/civitai/search?types=LORA&query=anime&limit=12&page=1
Returns: { "items": [...], "metadata": {...} }
```

## Support

For issues:
1. Check this README
2. Look at console logs (both browser and backend terminal)
3. Verify all three services are running (ComfyUI, Backend, Frontend)
4. Try the "Test Backend Connection" button in the Browse tab

## Credits

- Frontend: React + TypeScript + Tailwind CSS + shadcn/ui
- Backend: Python + Flask
- ComfyUI: AI image generation engine
- Civitai: Model repository
