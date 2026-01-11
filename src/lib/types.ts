export interface ComfyUIConfig {
  server: string
  clientId: string
}

export interface GenerationParams {
  modelName: string
  loraName?: string
  loraStrength: number
  positivePrompt: string
  negativePrompt: string
}

export interface CivitaiModel {
  id: number
  name: string
  type: string
  modelVersions: Array<{
    id: number
    name: string
    images: Array<{
      url: string
      width: number
      height: number
    }>
    files: Array<{
      name: string
      downloadUrl: string
      sizeKB: number
    }>
  }>
}

export interface CivitaiSearchParams {
  assetType: 'LORA' | 'Checkpoint'
  query: string
  page: number
  perPage: number
}

export interface GenerationStatus {
  isGenerating: boolean
  progress?: number
  currentNode?: string
}
