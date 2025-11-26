# 🌍 3D Earth Visualizer

A real-time interactive 3D visualization of global financial exchanges and cloud regions built with Next.js, Three.js, and React Three Fiber. Shows stock exchanges, cloud provider regions, and simulated real-time latency connections on an interactive globe.

## Features

### Core
- Interactive 3D Earth (Three.js + R3F)
- Real-time simulated latency arcs between exchanges and nearest cloud regions
- Clickable markers for:
    - Stock Exchanges
    - AWS, GCP, Azure Cloud Regions
- Camera auto-focus on clicked markers

### Analytics & Info
- Historical latency chart panel
- Tooltip system (HTML-based)
- System metrics: FPS, frame time, memory, visible markers/arcs

### UI & UX
- Control panel with filters:
    - Toggle cloud providers
    - Toggle exchanges
    - Marker visibility
    - Real-time latency layer
    - Search (auto-focus result)
- Legend panel with provider color codes
- Mobile optimizations:
    - Reduced globe segments
    - Lower DPR for GPU efficiency
    - Fewer arcs, improved touch gestures
    - Sliding control panel & compact UI

## Tech Stack
- Framework: Next.js 16 (App Router)
- Language: TypeScript
- 3D Engine: Three.js
- React Renderer: React Three Fiber + Drei
- Charts: Recharts (LatencyPanel)
- State & Hooks: Custom hooks for latency simulation & system metrics

## Getting Started (Local)
1. Clone
     git clone https://github.com/AqdasAhmed/3d-earth-visualizer.git
     cd 3d-earth-visualizer
2. Install (Node.js 18+)
     npm install
     # or yarn install / pnpm install / bun install
3. Run dev server
     npm run dev
     Visit: http://localhost:3000
4. Build & run production
     npm run build
     npm run start

Note: The page auto-refreshes on file edits.

## Project Structure (important files)
src/
 ├── app/              # page.tsx (main app)
 ├── components/       # 3D & UI components
 ├── hooks/            # custom hooks (metrics, latency, etc.)
 ├── utils/            # geo & math helpers
 ├── data/             # exchange + region datasets
 └── styles/           # global CSS

## Key Components
- Globe — sphere mesh + textures
- ExchangeMarker — exchange markers
- CloudRegionMarker — cloud region markers
- LatencyConnection — animated arcs
- CameraRig — smooth camera movements
- Tooltip3D — HTML tooltip
- ControlPanel — filter menu
- Legend — provider color labels
- LatencyPanel — historical latency chart

## Submission Guidelines (assignment)
- Provide video demo + code walk-through
- Include run instructions (above)
- Submit GitHub repo link
- Attach resume
- Document libraries used & assumptions
- Email to: careers@goquant.io
    CC: jennifer.carreno@goquant.io
    Subject: Assignment Title

## Assumptions
- Latency is simulated (not from API)
- Globe texture simplified for performance
- Data updates in intervals (1–1.5s depending on device)
- Historical latency generated via useLatencyPairs

## Libraries Used
- three
- @react-three/fiber
- @react-three/drei
- recharts
- next
- typescript

## Performance Optimizations
- Dynamic DPR scaling
- Reduced globe segments on mobile
- Limit arcs on smaller devices
- Memoization for heavy computations
- Removed Suspense boundaries from 3D pipeline

## Tips & Pointers
- Tip: Reduce DPR and segments while profiling on low-end devices.
- Pointer: Use memoized geometry and instancing for many markers.
- Note: Keep latency simulation decoupled from rendering to avoid frame drops.

## Author
Aqdas Ahmed  
GitHub: https://github.com/AqdasAhmed
