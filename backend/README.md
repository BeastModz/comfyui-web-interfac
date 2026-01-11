# ComfyUI Studio Backend

Python Flask backend server that proxies requests between the browser frontend and ComfyUI/Civitai APIs.

## Why a Backend?

Browsers cannot directly connect to ComfyUI due to CORS (Cross-Origin Resource Sharing) security restrictions. This backend server acts as a proxy, handling:

- ComfyUI API requests (model lists, prompt queuing, image retrieval)
- Civitai API requests (model search and browsing)
- WebSocket connections for real-time generation progress

## Installation

1. Make sure you have Python 3.8+ installed
2. Install dependencies:

```bash
cd backend
pip install -r requirements.txt
```

## Running the Server

```bash
python server.py
```

The server will start on `http://localhost:5000`

## Configuration

Edit `server.py` to change:
- `COMFY_SERVER`: Your ComfyUI server address (default: `127.0.0.1:8188`)
- Port: Change the `port=5000` parameter in `app.run()`

## API Endpoints

### ComfyUI Proxy Endpoints

- `GET /api/comfy/models/<node_type>/<input_name>` - Get available models
- `POST /api/comfy/queue` - Queue a generation prompt
- `POST /api/comfy/interrupt` - Stop current generation
- `GET /api/comfy/history/<prompt_id>` - Get generation history
- `GET /api/comfy/view` - Proxy image viewing
- `GET /api/comfy/ws-status` - Check WebSocket connectivity

### Civitai Proxy Endpoints

- `GET /api/civitai/search` - Search for models on Civitai
- `POST /api/civitai/download` - Get download URL for a model

### System Endpoints

- `GET /api/health` - Health check

## Usage with Frontend

Make sure the backend is running before starting the frontend. The frontend is configured to connect to `http://localhost:5000`.

1. Start backend: `python backend/server.py`
2. Start frontend: `npm run dev`
3. Open browser to the frontend URL

## Troubleshooting

**ComfyUI Connection Issues:**
- Ensure ComfyUI is running on `127.0.0.1:8188` (or update `COMFY_SERVER`)
- Check ComfyUI logs for errors
- Try accessing `http://127.0.0.1:8188` in your browser

**Civitai API Issues:**
- Check your internet connection
- Civitai may have rate limits - try again after a few minutes
- Some models may require authentication - download manually from civitai.com

**CORS Errors:**
- Make sure both frontend and backend are running
- Check that frontend is making requests to `http://localhost:5000`
- Restart both servers if issues persist
