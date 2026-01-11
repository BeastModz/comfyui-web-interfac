import { useState, useEffect, useRef } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Slider } from '@/components/ui/slider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Lightning, Stop, Image as ImageIcon, Sliders } from '@phosphor-icons/react'
import { ComfyUIAPI } from '@/lib/comfyui-api'
import { GenerationParams } from '@/lib/types'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

interface GenerateTabProps {
  comfyAPI: ComfyUIAPI
  models: string[]
  loras: string[]
  isConnected: boolean
}

export function GenerateTab({ comfyAPI, models, loras, isConnected }: GenerateTabProps) {
  const [selectedModel, setSelectedModel] = useKV<string>('comfy-selected-model', models[0] || '')
  const [selectedLora, setSelectedLora] = useKV<string>('comfy-selected-lora', 'None')
  const [loraStrength, setLoraStrength] = useKV<number>('comfy-lora-strength', 1.0)
  const [positivePrompt, setPositivePrompt] = useKV<string>('comfy-positive-prompt', '')
  const [negativePrompt, setNegativePrompt] = useKV<string>('comfy-negative-prompt', 'bad quality, ugly, blurry')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImages, setGeneratedImages] = useKV<string[]>('comfy-generated-images', [])
  const wsRef = useRef<WebSocket | null>(null)

  const currentLoraStrength = loraStrength ?? 1.0
  const currentPositivePrompt = positivePrompt ?? ''
  const currentNegativePrompt = negativePrompt ?? 'bad quality, ugly, blurry'
  const currentSelectedLora = selectedLora ?? 'None'
  const currentSelectedModel = selectedModel ?? ''
  const currentGeneratedImages = generatedImages ?? []

  useEffect(() => {
    if (models.length > 0 && !currentSelectedModel) {
      setSelectedModel(models[0])
    }
  }, [models, currentSelectedModel, setSelectedModel])

  const handleGenerate = async () => {
    if (!currentSelectedModel) {
      toast.error('Please select a model')
      return
    }

    setIsGenerating(true)
    
    try {
      const params: GenerationParams = {
        modelName: currentSelectedModel,
        loraName: currentSelectedLora !== 'None' ? currentSelectedLora : undefined,
        loraStrength: currentLoraStrength,
        positivePrompt: currentPositivePrompt,
        negativePrompt: currentNegativePrompt
      }

      const workflow = comfyAPI.buildWorkflow(params)
      const { prompt_id } = await comfyAPI.queuePrompt(workflow)

      toast.success('Generation started')

      const ws = comfyAPI.createWebSocket()
      wsRef.current = ws

      ws.onopen = () => {
        console.log('WebSocket connected')
      }

      ws.onmessage = async (event) => {
        if (typeof event.data === 'string') {
          const message = JSON.parse(event.data)
          
          if (message.type === 'executing') {
            const data = message.data
            if (data.node === null && data.prompt_id === prompt_id) {
              const history = await comfyAPI.getHistory(prompt_id)
              const outputs = history[prompt_id]?.outputs || {}
              
              const imageUrls: string[] = []
              for (const nodeId in outputs) {
                const nodeOutput = outputs[nodeId]
                if (nodeOutput.images) {
                  for (const image of nodeOutput.images) {
                    const url = comfyAPI.getImageUrl(image.filename, image.subfolder, image.type)
                    imageUrls.push(url)
                  }
                }
              }
              
              if (imageUrls.length > 0) {
                setGeneratedImages((current) => [...imageUrls, ...(current ?? [])])
                toast.success(`Generated ${imageUrls.length} image(s)`)
              }
              
              setIsGenerating(false)
              ws.close()
            }
          }
        }
      }

      ws.onerror = (error) => {
        console.error('WebSocket error:', error)
        toast.error('WebSocket connection error')
        setIsGenerating(false)
      }

      ws.onclose = () => {
        console.log('WebSocket closed')
        setIsGenerating(false)
      }
    } catch (error) {
      console.error('Generation error:', error)
      toast.error(error instanceof Error ? error.message : 'Generation failed')
      setIsGenerating(false)
    }
  }

  const handleStop = async () => {
    try {
      await comfyAPI.interrupt()
      if (wsRef.current) {
        wsRef.current.close()
      }
      setIsGenerating(false)
      toast.info('Generation interrupted')
    } catch (error) {
      console.error('Stop error:', error)
    }
  }

  return (
    <div className="grid lg:grid-cols-[400px,1fr] gap-6">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sliders weight="fill" />
              Generation Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="model-select">Model (GGUF)</Label>
              <Select
                value={selectedModel}
                onValueChange={setSelectedModel}
                disabled={!isConnected || models.length === 0}
              >
                <SelectTrigger id="model-select">
                  <SelectValue placeholder="Select model..." />
                </SelectTrigger>
                <SelectContent>
                  {models.map((model) => (
                    <SelectItem key={model} value={model}>
                      {model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lora-select">LoRA</Label>
              <Select
                value={selectedLora}
                onValueChange={setSelectedLora}
                disabled={!isConnected}
              >
                <SelectTrigger id="lora-select">
                  <SelectValue placeholder="Select LoRA..." />
                </SelectTrigger>
                <SelectContent>
                  {loras.map((lora) => (
                    <SelectItem key={lora} value={lora}>
                      {lora}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {currentSelectedLora !== 'None' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="lora-strength">LoRA Strength</Label>
                  <span className="text-sm font-mono text-muted-foreground">
                    {currentLoraStrength.toFixed(2)}
                  </span>
                </div>
                <Slider
                  id="lora-strength"
                  min={0}
                  max={3}
                  step={0.1}
                  value={[currentLoraStrength]}
                  onValueChange={([value]) => setLoraStrength(value)}
                  disabled={!isConnected}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="positive-prompt">Positive Prompt</Label>
              <Textarea
                id="positive-prompt"
                value={positivePrompt}
                onChange={(e) => setPositivePrompt(e.target.value)}
                placeholder="Describe your image..."
                rows={4}
                disabled={!isConnected}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="negative-prompt">Negative Prompt</Label>
              <Textarea
                id="negative-prompt"
                value={negativePrompt}
                onChange={(e) => setNegativePrompt(e.target.value)}
                placeholder="What to avoid..."
                rows={3}
                disabled={!isConnected}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                onClick={handleGenerate}
                disabled={!isConnected || isGenerating || !selectedModel}
                className="flex-1 gap-2"
                size="lg"
              >
                <Lightning weight="fill" size={20} />
                {isGenerating ? 'Generating...' : 'Generate'}
              </Button>
              {isGenerating && (
                <Button
                  onClick={handleStop}
                  variant="destructive"
                  size="lg"
                  className="gap-2"
                >
                  <Stop weight="fill" size={20} />
                  Stop
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <ImageIcon weight="fill" />
            Generated Images
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentGeneratedImages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
              <ImageIcon size={64} weight="thin" className="mb-4 opacity-50" />
              <p>No images generated yet</p>
              <p className="text-sm mt-1">Configure settings and click Generate to start</p>
            </div>
          ) : (
            <ScrollArea className="h-[calc(100vh-280px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 stagger-fade-in">
                <AnimatePresence>
                  {currentGeneratedImages.map((url, index) => (
                    <motion.div
                      key={url}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="relative aspect-[9/16] rounded-lg overflow-hidden bg-muted group"
                    >
                      <img
                        src={url}
                        alt={`Generated ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
