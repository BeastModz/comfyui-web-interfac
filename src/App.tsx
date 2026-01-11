import { useState, useEffect, useCallback } from 'react'
import { useKV } from '@github/spark/hooks'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Lightning, Stack } from '@phosphor-icons/react'
import { GenerateTab } from '@/components/GenerateTab'
import { BrowseTab } from '@/components/BrowseTab'
import { ComfyUIAPI } from '@/lib/comfyui-api'
import { toast, Toaster } from 'sonner'

const COMFY_SERVER = '127.0.0.1:8188'
const CLIENT_ID = crypto.randomUUID()

function App() {
  const [comfyAPI] = useState(() => new ComfyUIAPI({ server: COMFY_SERVER, clientId: CLIENT_ID }))
  const [isConnected, setIsConnected] = useState(false)
  const [isCheckingConnection, setIsCheckingConnection] = useState(true)
  const [models, setModels] = useState<string[]>([])
  const [loras, setLoras] = useState<string[]>([])

  const checkConnection = useCallback(async () => {
    setIsCheckingConnection(true)
    try {
      const modelList = await comfyAPI.getModels('UnetLoaderGGUF', 'unet_name')
      const loraList = await comfyAPI.getModels('LoraLoader', 'lora_name')
      
      setModels(modelList)
      setLoras(['None', ...loraList])
      setIsConnected(true)
      
      if (modelList.length === 0) {
        toast.warning('No models found. Please install models in ComfyUI.')
      }
    } catch (error) {
      setIsConnected(false)
      console.error('Connection error:', error)
    } finally {
      setIsCheckingConnection(false)
    }
  }, [comfyAPI])

  useEffect(() => {
    checkConnection()
  }, [checkConnection])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster position="top-right" theme="dark" />
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <header className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2" style={{ letterSpacing: '-0.02em' }}>
            ComfyUI Studio
          </h1>
          <p className="text-muted-foreground">
            Professional AI image generation interface
          </p>
        </header>

        {!isConnected && !isCheckingConnection && (
          <Alert className="mb-6 border-destructive/50 bg-destructive/10">
            <AlertDescription>
              Cannot connect to ComfyUI at {COMFY_SERVER}. Please ensure ComfyUI is running.
              <button
                onClick={checkConnection}
                className="ml-4 underline hover:text-foreground transition-colors"
              >
                Retry Connection
              </button>
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="generate" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="generate" className="gap-2">
              <Lightning weight="fill" size={18} />
              Generate
            </TabsTrigger>
            <TabsTrigger value="browse" className="gap-2">
              <Stack weight="fill" size={18} />
              Browse Models
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-6">
            <GenerateTab
              comfyAPI={comfyAPI}
              models={models}
              loras={loras}
              isConnected={isConnected}
            />
          </TabsContent>

          <TabsContent value="browse" className="space-y-6">
            <BrowseTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default App
