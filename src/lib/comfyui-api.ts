import { ComfyUIConfig, GenerationParams, CivitaiSearchParams, CivitaiModel } from './types'

const WORKFLOW_TEMPLATE = {
  "213": {
    "inputs": {
      "text": "",
      "clip": ["322", 1]
    },
    "class_type": "CLIPTextEncode"
  },
  "214": {
    "inputs": {
      "noise_seed": ["245", 0]
    },
    "class_type": "RandomNoise"
  },
  "215": {
    "inputs": {
      "cfg": 1,
      "model": ["322", 0],
      "positive": ["226", 0],
      "negative": ["218", 0]
    },
    "class_type": "CFGGuider"
  },
  "217": {
    "inputs": {
      "vae_name": "ae.safetensors"
    },
    "class_type": "VAELoader"
  },
  "218": {
    "inputs": {
      "conditioning": ["213", 0]
    },
    "class_type": "ConditioningZeroOut"
  },
  "219": {
    "inputs": {
      "noise": ["214", 0],
      "guider": ["215", 0],
      "sampler": ["238", 0],
      "sigmas": ["232", 0],
      "latent_image": ["231", 0]
    },
    "class_type": "SamplerCustomAdvanced"
  },
  "220": {
    "inputs": {
      "filename_prefix": "ComfyUI",
      "images": ["246", 0]
    },
    "class_type": "SaveImage"
  },
  "222": {
    "inputs": {
      "samples": ["242", 0],
      "vae": ["217", 0]
    },
    "class_type": "VAEDecode"
  },
  "224": {
    "inputs": {
      "width": 1088,
      "height": 1920,
      "batch_size": 1
    },
    "class_type": "EmptySD3LatentImage"
  },
  "226": {
    "inputs": {
      "randomize_percent": 50,
      "strength": 20,
      "noise_insert": "noise on beginning steps",
      "steps_switchover_percent": 20,
      "seed": ["245", 0],
      "mask_starts_at": "beginning",
      "mask_percent": 0,
      "log_to_console": false,
      "conditioning": ["239", 0]
    },
    "class_type": "SeedVarianceEnhancer"
  },
  "227": {
    "inputs": {
      "randomize_percent": 50,
      "strength": 20,
      "noise_insert": "noise on beginning steps",
      "steps_switchover_percent": 20,
      "seed": ["245", 0],
      "mask_starts_at": "beginning",
      "mask_percent": 0,
      "log_to_console": false,
      "conditioning": ["239", 0]
    },
    "class_type": "SeedVarianceEnhancer"
  },
  "229": {
    "inputs": {
      "unet_name": "z_image_turbo-Q8_0.gguf"
    },
    "class_type": "UnetLoaderGGUF"
  },
  "230": {
    "inputs": {
      "clip_name": "Qwen3-4B-UD-Q6_K_XL.gguf",
      "type": "lumina2"
    },
    "class_type": "CLIPLoaderGGUF"
  },
  "231": {
    "inputs": {
      "seed": ["245", 0],
      "steps": 8,
      "cfg": 1,
      "sampler_name": "res_multistep",
      "scheduler": "simple",
      "denoise": 1,
      "model": ["322", 0],
      "positive": ["227", 0],
      "negative": ["218", 0],
      "latent_image": ["224", 0]
    },
    "class_type": "KSampler"
  },
  "232": {
    "inputs": {
      "scheduler": "simple",
      "steps": 8,
      "denoise": 1,
      "model": ["322", 0]
    },
    "class_type": "BasicScheduler"
  },
  "233": {
    "inputs": {
      "sampler_name": "euler"
    },
    "class_type": "KSamplerSelect"
  },
  "234": {
    "inputs": {
      "rgthree_comparer": {
        "images": []
      },
      "image_a": ["240", 0],
      "image_b": ["246", 0]
    },
    "class_type": "Image Comparer (rgthree)"
  },
  "236": {
    "inputs": {
      "filename_prefix": "ComfyUI",
      "images": ["240", 0]
    },
    "class_type": "SaveImage"
  },
  "238": {
    "inputs": {
      "detail_amount": 1.2,
      "start": 0,
      "end": 1,
      "bias": 0.5,
      "exponent": 3,
      "start_offset": 0,
      "end_offset": 0,
      "fade": 0,
      "smooth": true,
      "cfg_scale_override": 0,
      "sampler": ["233", 0]
    },
    "class_type": "DetailDaemonSamplerNode"
  },
  "239": {
    "inputs": {
      "text": "",
      "clip": ["322", 1]
    },
    "class_type": "CLIPTextEncode"
  },
  "240": {
    "inputs": {
      "samples": ["231", 0],
      "vae": ["217", 0]
    },
    "class_type": "VAEDecode"
  },
  "241": {
    "inputs": {
      "shift": 3,
      "model": ["229", 0]
    },
    "class_type": "ModelSamplingAuraFlow"
  },
  "242": {
    "inputs": {
      "seed": 0,
      "steps": 2,
      "cfg": 1,
      "sampler_name": "euler",
      "scheduler": "simple",
      "denoise": 0.05,
      "model": ["322", 0],
      "positive": ["239", 0],
      "negative": ["218", 0],
      "latent_image": ["219", 0]
    },
    "class_type": "KSampler"
  },
  "245": {
    "inputs": {
      "seed": 0
    },
    "class_type": "easy seed"
  },
  "246": {
    "inputs": {
      "strength": 0.4,
      "images": ["248", 0]
    },
    "class_type": "FastLaplacianSharpen"
  },
  "247": {
    "inputs": {
      "grain_intensity": 0.012,
      "saturation_mix": 0.3,
      "batch_size": 4,
      "images": ["321", 0]
    },
    "class_type": "FastFilmGrain"
  },
  "248": {
    "inputs": {
      "anything": ["249", 0]
    },
    "class_type": "easy clearCacheAll"
  },
  "249": {
    "inputs": {
      "anything": ["222", 0]
    },
    "class_type": "easy cleanGpuUsed"
  },
  "319": {
    "inputs": {
      "filename_prefix": "ComfyUI",
      "images": ["247", 0]
    },
    "class_type": "SaveImage"
  },
  "320": {
    "inputs": {
      "model_name": "4x-ClearRealityV1.pth"
    },
    "class_type": "UpscaleModelLoader"
  },
  "321": {
    "inputs": {
      "upscale_method": "nearest-exact",
      "factor": 2,
      "upscale_model": ["320", 0],
      "image": ["246", 0]
    },
    "class_type": "Upscale by Factor with Model (WLSH)"
  },
  "322": {
    "inputs": {
      "lora_01": "None",
      "strength_01": 1.0,
      "lora_02": "None",
      "strength_02": 1.0,
      "lora_03": "None",
      "strength_03": 1.0,
      "lora_04": "None",
      "strength_04": 1.0,
      "model": ["241", 0],
      "clip": ["230", 0]
    },
    "class_type": "Lora Loader Stack (rgthree)"
  }
}

export class ComfyUIAPI {
  private config: ComfyUIConfig
  private backendUrl: string

  constructor(config: ComfyUIConfig) {
    this.config = config
    this.backendUrl = 'http://localhost:5001/api'
  }

  async getModels(nodeType: string, inputName: string): Promise<string[]> {
    try {
      const response = await fetch(`${this.backendUrl}/comfy/models/${nodeType}/${inputName}`)
      
      if (!response.ok) {
        console.error(`API returned status ${response.status}`)
        return []
      }
      
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        console.error(`Expected JSON but got ${contentType}`)
        return []
      }
      
      const data = await response.json()
      return data.models || []
    } catch (error) {
      console.error(`Error fetching ${nodeType}:`, error)
      return []
    }
  }

  async queuePrompt(workflow: any): Promise<{ prompt_id: string }> {
    const payload = {
      workflow: workflow,
      client_id: this.config.clientId
    }

    const response = await fetch(`${this.backendUrl}/comfy/queue`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        const error = await response.json()
        throw new Error(error.error || 'ComfyUI rejected workflow')
      } else {
        throw new Error(`Server error: ${response.status} ${response.statusText}`)
      }
    }

    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error(`Expected JSON response but got ${contentType}`)
    }
    
    return response.json()
  }

  async interrupt(): Promise<void> {
    await fetch(`${this.backendUrl}/comfy/interrupt`, { method: 'POST' })
  }

  async getHistory(promptId: string): Promise<any> {
    const response = await fetch(`${this.backendUrl}/comfy/history/${promptId}`)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch history: ${response.status}`)
    }
    
    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error(`Expected JSON but got ${contentType}`)
    }
    
    return response.json()
  }

  getImageUrl(filename: string, subfolder: string, type: string): string {
    const params = new URLSearchParams({ filename, subfolder, type })
    return `${this.backendUrl}/comfy/view?${params}`
  }

  createWebSocket(): WebSocket {
    return new WebSocket(`ws://${this.config.server}/ws?clientId=${this.config.clientId}`)
  }

  async checkBackendHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.backendUrl.replace('/api', '')}/api/health`)
      
      if (!response.ok) {
        console.error(`Backend health check failed with status ${response.status}`)
        return false
      }
      
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        console.error(`Backend returned non-JSON response: ${contentType}`)
        return false
      }
      
      const data = await response.json()
      return data.status === 'ok'
    } catch (error) {
      console.error('Backend health check failed:', error)
      return false
    }
  }

  buildWorkflow(params: GenerationParams): any {
    const workflow = JSON.parse(JSON.stringify(WORKFLOW_TEMPLATE))

    workflow["229"].inputs.unet_name = params.modelName

    if (params.loraName && params.loraName !== "None") {
      workflow["322"].inputs.lora_01 = params.loraName
      workflow["322"].inputs.strength_01 = params.loraStrength
    } else {
      workflow["322"].inputs.lora_01 = "None"
      workflow["322"].inputs.strength_01 = 0
    }

    workflow["322"].inputs.lora_02 = "None"
    workflow["322"].inputs.strength_02 = 0
    workflow["322"].inputs.lora_03 = "None"
    workflow["322"].inputs.strength_03 = 0
    workflow["322"].inputs.lora_04 = "None"
    workflow["322"].inputs.strength_04 = 0

    workflow["239"].inputs.text = params.positivePrompt || ""
    workflow["213"].inputs.text = params.negativePrompt || ""

    workflow["245"].inputs.seed = Math.floor(Math.random() * 999999999999999)

    return workflow
  }
}

export class CivitaiAPI {
  private backendUrl = 'http://localhost:5001/api'

  async search(params: CivitaiSearchParams): Promise<CivitaiModel[]> {
    const searchParams = new URLSearchParams({
      limit: params.perPage.toString(),
      page: params.page.toString(),
      types: params.assetType
    })

    if (params.query && params.query.trim()) {
      searchParams.set('query', params.query.trim())
    }

    const url = `${this.backendUrl}/civitai/search?${searchParams.toString()}`
    console.log('🔍 Civitai API request via backend:', url)

    try {
      const response = await fetch(url)
      
      console.log('📡 Response status:', response.status, response.statusText)
      
      if (!response.ok) {
        const contentType = response.headers.get('content-type')
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json()
          console.error('❌ Backend error response:', errorData)
          throw new Error(errorData.error || `Failed to fetch models: ${response.status}`)
        } else {
          console.error('❌ Backend returned non-JSON error:', contentType)
          throw new Error(`Backend error: ${response.status} ${response.statusText}`)
        }
      }
      
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        console.error('❌ Expected JSON but got:', contentType)
        const text = await response.text()
        console.error('Response body:', text.substring(0, 200))
        throw new Error(`Expected JSON response but got ${contentType || 'unknown content type'}`)
      }
      
      const data = await response.json()
      console.log('✅ Civitai API response:', {
        itemsCount: data.items?.length || 0,
        metadata: data.metadata,
        firstItem: data.items?.[0]
      })
      
      if (!data.items || !Array.isArray(data.items)) {
        console.warn('⚠️ Unexpected API response structure:', data)
        return []
      }
      
      return data.items
    } catch (error) {
      console.error('❌ Civitai search error:', error)
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Backend server not reachable. Please ensure the Python backend is running on http://localhost:5000')
      }
      throw error
    }
  }

  getPreviewImage(model: CivitaiModel): string | null {
    const images = model.modelVersions?.[0]?.images
    if (images && images.length > 0) {
      return images[0].url
    }
    return null
  }

  getDownloadUrl(model: CivitaiModel): string | null {
    const files = model.modelVersions?.[0]?.files
    if (files && Array.isArray(files)) {
      for (const file of files) {
        if (file.downloadUrl) {
          return file.downloadUrl
        }
      }
    }
    return null
  }
}
