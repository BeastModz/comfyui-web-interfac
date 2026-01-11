#!/usr/bin/env python3
"""
ComfyUI Studio Backend Server
Flask backend that proxies requests to ComfyUI and Civitai APIs
"""

from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import requests
import json
import uuid
import io
from PIL import Image
import websocket
import threading
import time

app = Flask(__name__)
CORS(app)

COMFY_SERVER = "127.0.0.1:8188"
CIVITAI_BASE_URL = "https://civitai.com/api/v1"

active_websockets = {}

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "ok", "server": "ComfyUI Studio Backend"})

@app.route('/api/comfy/models/<node_type>/<input_name>', methods=['GET'])
def get_models(node_type, input_name):
    """Get available models from ComfyUI"""
    try:
        response = requests.get(f"http://{COMFY_SERVER}/object_info/{node_type}")
        response.raise_for_status()
        data = response.json()
        
        models = data.get(node_type, {}).get("input", {}).get("required", {}).get(input_name, [[]])[0]
        return jsonify({"models": models})
    except Exception as e:
        return jsonify({"error": str(e), "models": []}), 500

@app.route('/api/comfy/queue', methods=['POST'])
def queue_prompt():
    """Queue a prompt to ComfyUI"""
    try:
        workflow = request.json.get('workflow')
        client_id = request.json.get('client_id', str(uuid.uuid4()))
        
        payload = {
            "prompt": workflow,
            "client_id": client_id
        }
        
        response = requests.post(
            f"http://{COMFY_SERVER}/prompt",
            json=payload,
            headers={"Content-Type": "application/json"}
        )
        
        if not response.ok:
            error_text = response.text
            return jsonify({"error": f"ComfyUI rejected workflow: {error_text}"}), 400
        
        result = response.json()
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/comfy/interrupt', methods=['POST'])
def interrupt_generation():
    """Interrupt current ComfyUI generation"""
    try:
        response = requests.post(f"http://{COMFY_SERVER}/interrupt")
        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/comfy/history/<prompt_id>', methods=['GET'])
def get_history(prompt_id):
    """Get generation history from ComfyUI"""
    try:
        response = requests.get(f"http://{COMFY_SERVER}/history/{prompt_id}")
        response.raise_for_status()
        return jsonify(response.json())
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/comfy/view', methods=['GET'])
def view_image():
    """Proxy image requests from ComfyUI"""
    try:
        filename = request.args.get('filename')
        subfolder = request.args.get('subfolder', '')
        folder_type = request.args.get('type', 'output')
        
        params = {
            'filename': filename,
            'subfolder': subfolder,
            'type': folder_type
        }
        
        response = requests.get(f"http://{COMFY_SERVER}/view", params=params, stream=True)
        response.raise_for_status()
        
        return send_file(
            io.BytesIO(response.content),
            mimetype=response.headers.get('content-type', 'image/png')
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/civitai/search', methods=['GET'])
def civitai_search():
    """Search Civitai for models"""
    try:
        asset_type = request.args.get('types', 'LORA')
        query = request.args.get('query', '')
        page = request.args.get('page', '1')
        limit = request.args.get('limit', '12')
        
        params = {
            'types': asset_type,
            'page': page,
            'limit': limit,
            'sort': 'Most Downloaded'
        }
        
        if query:
            params['query'] = query
        
        print(f"🔍 Civitai search request: {params}")
        
        response = requests.get(f"{CIVITAI_BASE_URL}/models", params=params, timeout=10)
        response.raise_for_status()
        
        data = response.json()
        print(f"✅ Civitai returned {len(data.get('items', []))} items")
        
        return jsonify(data)
    except requests.exceptions.Timeout:
        return jsonify({"error": "Request to Civitai timed out", "items": []}), 504
    except requests.exceptions.RequestException as e:
        print(f"❌ Civitai error: {e}")
        return jsonify({"error": str(e), "items": []}), 500
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return jsonify({"error": str(e), "items": []}), 500

@app.route('/api/civitai/download', methods=['POST'])
def civitai_download():
    """Download a model from Civitai"""
    try:
        download_url = request.json.get('url')
        
        if not download_url:
            return jsonify({"error": "No download URL provided"}), 400
        
        return jsonify({
            "message": "Download link ready",
            "url": download_url
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/comfy/ws-status', methods=['GET'])
def websocket_status():
    """Check if WebSocket connection is possible"""
    try:
        client_id = str(uuid.uuid4())
        ws_url = f"ws://{COMFY_SERVER}/ws?clientId={client_id}"
        
        ws = websocket.WebSocket()
        ws.settimeout(5)
        ws.connect(ws_url)
        ws.close()
        
        return jsonify({"connected": True})
    except Exception as e:
        return jsonify({"connected": False, "error": str(e)}), 503

if __name__ == '__main__':
    print("🚀 Starting ComfyUI Studio Backend")
    print(f"📡 ComfyUI Server: {COMFY_SERVER}")
    print(f"🌐 Backend running on http://localhost:5000")
    print(f"🔗 Civitai API: {CIVITAI_BASE_URL}")
    print("\n✅ Ready to accept requests!\n")
    
    app.run(host='0.0.0.0', port=5000, debug=True, threaded=True)
