# Planning Guide

A powerful web-based frontend for ComfyUI that enables users to generate AI images through an intuitive interface and discover new models from Civitai, using a Python backend to bypass browser security restrictions.

**Experience Qualities**:
1. **Powerful** - Professional-grade controls that give users complete command over AI image generation with clear feedback on processing status
2. **Explorative** - Encourage discovery of new models and LoRAs through integrated Civitai browsing with visual previews
3. **Streamlined** - Remove complexity without sacrificing functionality, making advanced AI image generation accessible

**Complexity Level**: Light Application (multiple features with basic state)
This app combines image generation controls, real-time progress tracking, and model browsing with a Python Flask backend server that acts as a proxy between the browser and ComfyUI/Civitai APIs to avoid CORS security restrictions.

## Essential Features

**Image Generation**
- Functionality: Submit prompts and parameters to ComfyUI API to generate images
- Purpose: Core value proposition - turn text descriptions into AI-generated images
- Trigger: User fills prompt fields and clicks "Generate"
- Progression: Configure parameters → Enter prompts → Click Generate → Monitor progress → View results in gallery
- Success criteria: Images appear in gallery within reasonable time, error states are clearly communicated

**Model Selection**
- Functionality: Choose from available GGUF models and LoRAs with strength control
- Purpose: Let users customize the AI's artistic style and capabilities
- Trigger: User opens model/LoRA dropdown menus
- Progression: View available models → Select model → Optionally add LoRA → Adjust strength slider
- Success criteria: Dropdowns populate from ComfyUI API, selections persist during session

**Civitai Model Browser**
- Functionality: Search, preview, and download models/LoRAs from Civitai marketplace
- Purpose: Expand user's creative toolkit without leaving the application
- Trigger: User switches to "Browse Models" tab
- Progression: Enter search query → View thumbnail grid → Click model → See details → Download to ComfyUI
- Progression: Search results display with previews → User can download models directly
- Success criteria: Search returns relevant results with images, downloads complete successfully

**Generation Control**
- Functionality: Stop ongoing generations that are taking too long or producing unwanted results
- Purpose: Give users control over compute resources and time
- Trigger: User clicks "Stop" button during active generation
- Progression: Generation running → User clicks Stop → Request sent to ComfyUI → Generation halts
- Success criteria: Interrupt command reaches ComfyUI API successfully

## Edge Case Handling
- **No ComfyUI Connection**: Display clear error banner with connection instructions and retry button
- **Empty Model Lists**: Show helpful message prompting user to install models with link to documentation
- **Failed Downloads**: Toast notification with specific error message and retry option
- **Incomplete Prompts**: Allow generation with empty prompts (some models work with minimal guidance)
- **Concurrent Generations**: Disable generate button during active processing to prevent queue conflicts

## Design Direction

The interface should feel like a high-powered creative tool - think DaVinci Resolve or Figma rather than consumer photo apps. Dark, focused atmosphere that keeps attention on the generated artwork. Controls should feel precise and responsive with tactile feedback. The design should communicate technical capability while remaining approachable.

## Color Selection

A dark, focused palette that emphasizes the generated artwork with vibrant accent colors for interactive elements.

- **Primary Color**: Deep Purple `oklch(0.45 0.15 285)` - Represents AI/technology with creative energy, used for primary actions
- **Secondary Colors**: Dark slate backgrounds `oklch(0.15 0.01 265)` for main canvas, slightly lighter `oklch(0.20 0.01 265)` for elevated cards
- **Accent Color**: Electric Cyan `oklch(0.75 0.15 195)` - High-energy highlight for CTAs, active states, and progress indicators
- **Foreground/Background Pairings**:
  - Background (Dark Slate #1A1B2E): Light text `oklch(0.95 0.01 265)` - Ratio 12.1:1 ✓
  - Card (Elevated Slate #25273D): Light text `oklch(0.95 0.01 265)` - Ratio 9.8:1 ✓
  - Primary (Deep Purple): White text `oklch(1 0 0)` - Ratio 5.2:1 ✓
  - Accent (Electric Cyan): Dark text `oklch(0.15 0.01 265)` - Ratio 9.5:1 ✓

## Font Selection

Typography should balance technical precision with creative expression, using a modern sans-serif with strong geometric qualities.

- **Typographic Hierarchy**:
  - H1 (Page Title): Space Grotesk Bold/32px/tight letter-spacing (-0.02em)
  - H2 (Section Headers): Space Grotesk Semibold/20px/normal letter-spacing
  - Body (Labels/Text): Inter Regular/14px/relaxed line-height (1.6)
  - Captions (Help Text): Inter Regular/12px/muted color
  - Code (Technical Values): JetBrains Mono Regular/13px/tabular numbers

## Animations

Motion should feel snappy and purposeful, reinforcing user actions without slowing down the workflow.

- **Button Interactions**: Quick scale (0.98) on press with 100ms spring animation
- **Tab Transitions**: Smooth opacity crossfade over 200ms when switching between Generate/Browse
- **Gallery Reveal**: Staggered fade-up animation (50ms delay between items) when images load
- **Progress Indicators**: Smooth indeterminate animation for WebSocket connection status
- **Model Cards**: Gentle lift and shadow expansion on hover over 150ms with ease-out

## Component Selection

- **Components**: 
  - Tabs (Generate vs Browse sections)
  - Card (Model preview cards, image result containers)
  - Button (Generate, Stop, Download, Search with distinct variants)
  - Select (Model and LoRA dropdowns)
  - Slider (LoRA strength control with visible value)
  - Textarea (Prompt inputs with auto-resize)
  - Input (Search field with icon)
  - Badge (Model type indicators, status chips)
  - ScrollArea (Gallery and search results)
  - Skeleton (Loading placeholders for model thumbnails)
  - Alert (Connection status, error messages)
  - Progress (Generation status bar)
  
- **Customizations**: 
  - Custom image gallery grid with aspect-ratio containers
  - WebSocket connection indicator component
  - Model card with overlay download button
  
- **States**: 
  - Buttons: Distinct hover lift, active press, disabled with reduced opacity, loading with spinner
  - Inputs: Focus ring in accent color, error state with red border
  - Dropdowns: Smooth expand/collapse, highlight on keyboard navigation
  
- **Icon Selection**: 
  - Phosphor "Lightning" for Generate
  - Phosphor "Stop" for interrupt
  - Phosphor "MagnifyingGlass" for search
  - Phosphor "DownloadSimple" for model downloads
  - Phosphor "Stack" for model selection
  - Phosphor "Sliders" for LoRA strength
  - Phosphor "Image" for gallery
  
- **Spacing**: 
  - Component padding: `p-6` for main sections, `p-4` for cards
  - Element gaps: `gap-4` for form groups, `gap-6` between major sections
  - Grid gaps: `gap-3` for model thumbnails
  
- **Mobile**: 
  - Stack Generate controls vertically with gallery below
  - Single-column model grid on mobile (2 cols tablet, 3-4 cols desktop)
  - Sticky generate button at bottom on mobile
  - Collapsible advanced options accordion on small screens
