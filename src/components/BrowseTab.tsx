import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { MagnifyingGlass, DownloadSimple, GlobeHemisphereWest, Info } from '@phosphor-icons/react'
import { CivitaiAPI } from '@/lib/comfyui-api'
import { CivitaiModel } from '@/lib/types'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

const civitaiAPI = new CivitaiAPI()

export function BrowseTab() {
  const [assetType, setAssetType] = useState<'LORA' | 'Checkpoint'>('LORA')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<CivitaiModel[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [page, setPage] = useState(1)
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = async () => {
    setIsSearching(true)
    setHasSearched(true)
    setPage(1)
    try {
      console.log('Starting search with params:', { assetType, query: searchQuery.trim(), page: 1, perPage: 12 })
      
      const results = await civitaiAPI.search({
        assetType,
        query: searchQuery.trim(),
        page: 1,
        perPage: 12
      })
      console.log('Search completed, results:', results.length)
      setSearchResults(results)
      
      if (results.length === 0) {
        toast.info('No results found. Try a different search term or browse without a query.')
      } else {
        toast.success(`Found ${results.length} ${assetType === 'LORA' ? 'LoRA' : 'checkpoint'} models`)
      }
    } catch (error) {
      console.error('Search error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      setDebugInfo(`Error: ${errorMessage}`)
      toast.error(`Search failed: ${errorMessage}`)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleAssetTypeChange = (newType: 'LORA' | 'Checkpoint') => {
    setAssetType(newType)
    if (hasSearched) {
      setSearchResults([])
      setHasSearched(false)
    }
  }

  const handleDownload = (model: CivitaiModel) => {
    const downloadUrl = civitaiAPI.getDownloadUrl(model)
    if (downloadUrl) {
      window.open(downloadUrl, '_blank')
      toast.success(`Opening download for ${model.name}`)
    } else {
      toast.error('No download URL available')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search Civitai</CardTitle>
          <CardDescription>
            Search and download LoRAs and Checkpoint models from Civitai
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label>Asset Type</Label>
            <RadioGroup
              value={assetType}
              onValueChange={handleAssetTypeChange}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="LORA" id="lora" />
                <Label htmlFor="lora" className="cursor-pointer font-normal">
                  LoRA
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Checkpoint" id="checkpoint" />
                <Label htmlFor="checkpoint" className="cursor-pointer font-normal">
                  Checkpoint
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="search-input">Search Query (optional)</Label>
            <div className="flex gap-3">
              <Input
                id="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Leave empty to browse popular models..."
                className="flex-1"
              />
              <Button
                onClick={handleSearch}
                disabled={isSearching}
                className="gap-2"
                size="lg"
              >
                <MagnifyingGlass size={20} weight="bold" />
                {isSearching ? 'Searching...' : 'Browse'}
              </Button>
            </div>
          </div>

          <Button
            onClick={() => {
              const searchUrl = searchQuery
                ? `https://civitai.com/models?query=${encodeURIComponent(searchQuery)}&types=${assetType}`
                : `https://civitai.com/models?types=${assetType}&sort=Most%20Downloaded`
              window.open(searchUrl, '_blank')
              toast.info('Opening Civitai in new tab')
            }}
            variant="outline"
            size="sm"
            className="w-full gap-2 text-xs"
          >
            <GlobeHemisphereWest size={16} />
            Browse on Civitai Website
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Results
            {searchResults.length > 0 && (
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({searchResults.length} found)
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isSearching ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-square w-full rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : searchResults.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground space-y-6">
              <div>
                <MagnifyingGlass size={64} weight="thin" className="mb-4 opacity-50" />
                <p className="text-lg">{hasSearched ? 'No results found' : 'Ready to browse'}</p>
                <p className="text-sm mt-1">
                  {hasSearched 
                    ? 'Try a different search term or browse without a query' 
                    : 'Click Browse to see popular models or enter a search term'}
                </p>
              </div>
              
              <Alert className="max-w-2xl text-left">
                <Info className="h-4 w-4" />
                <AlertDescription className="ml-2 space-y-2">
                  <p className="font-semibold">How to install models from Civitai:</p>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li>Click "Browse Civitai Website" above to open Civitai</li>
                    <li>Download the model file (.safetensors)</li>
                    <li>Place LoRA files in your ComfyUI <code className="text-xs bg-muted px-1 py-0.5 rounded">models/loras/</code> folder</li>
                    <li>Place Checkpoint files in your ComfyUI <code className="text-xs bg-muted px-1 py-0.5 rounded">models/checkpoints/</code> folder</li>
                    <li>Refresh this app to see the new models</li>
                  </ol>
                </AlertDescription>
              </Alert>
            </div>
          ) : (
            <ScrollArea className="h-[calc(100vh-400px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchResults.map((model, index) => {
                  const previewImage = civitaiAPI.getPreviewImage(model)
                  
                  return (
                    <motion.div
                      key={model.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                        <div className="relative aspect-square bg-muted overflow-hidden">
                          {previewImage ? (
                            <img
                              src={previewImage}
                              alt={model.name}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                              No Preview
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <Button
                            onClick={() => handleDownload(model)}
                            size="sm"
                            className="absolute bottom-3 right-3 gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          >
                            <DownloadSimple size={16} weight="bold" />
                            Download
                          </Button>
                        </div>
                        <div className="p-4 space-y-2">
                          <h3 className="font-semibold line-clamp-1">{model.name}</h3>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                              {model.type}
                            </Badge>
                            {model.modelVersions?.[0] && (
                              <span className="text-xs text-muted-foreground">
                                v{model.modelVersions[0].name}
                              </span>
                            )}
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
