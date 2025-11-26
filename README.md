# 🌍 3D Earth Visualizer

A real-time interactive 3D visualization of global financial exchanges and cloud regions, built using Next.js, Three.js, and React Three Fiber.

This project displays stock exchange locations, cloud provider regions, and simulated real-time latency connections — all rendered on an interactive 3D globe.

## ✨ Features
### 🎯 Core Functionality

- Interactive 3D Earth rendered using Three.js + R3F

- Real-time simulated latency arcs between exchanges and nearest cloud regions

- Clickable markers for:

  - Stock Exchanges

  - AWS, GCP, Azure Cloud Regions

- Camera auto-focus on clicked markers

### 📊 Analytics & Information

- Historical latency chart panel

- Tooltip system

- System metrics (FPS, frame time, memory usage, visible markers/arcs)

### 🧭 User Interface

- Control Panel with filters:

  - Cloud providers toggle

  - Exchanges toggle

  - Marker visibility

  - Real-time latency layer

  - Search (auto-focus on result)

- Legend panel with provider color codes

### 📱 Mobile Optimization

- Reduced segments for globe

- Lower pixel ratio for GPU efficiency

- Fewer arcs rendered

- Improved touch gestures

- Sliding control panel & compact UI

🛠️ Tech Stack
| Category          | Tools |
| ----------        | --------- |
|   Framework	    | Next.js 16 (App Router)|
|   Language	    |  TypeScript|
|   3D Engine	    | Three.js|
|   React Renderer  | React Three Fiber + Drei|
|   Charts	    | Recharts (Inside LatencyPanel)|
|   State & Hooks   | Custom hooks (latency simulation, system metrics)|

## 🚀 Getting Started (Local Setup)

Follow these steps to run the project on your machine.

### 📥 1. Clone the Repository
```
git clone https://github.com/AqdasAhmed/3d-earth-visualizer.git
cd 3d-earth-visualizer
```

### 📦 2. Install Dependencies

Make sure you have Node.js 18+ installed.
```
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### ▶️ 3. Run the Development Server
```
npm run dev
```

Now visit:

👉 [http://localhost:3000](URL)

The page will auto-refresh when you edit any files.

### 🏗️ 4. Build for Production
```
npm run build
npm run start
```

### 📁 Project Structure (Important Files)
```
src/
 ├── app/
 │    └── page.tsx            # Main app file
 ├── components/              # 3D + UI Components
 ├── hooks/                   # Custom hooks (metrics, latency, etc.)
 ├── utils/                   # Geo & math helpers
 ├── data/                    # Exchange + region datasets
 └── styles/                  # Global CSS
```

### 🧩 Key Components

**Globe –** sphere mesh + textures

**ExchangeMarker –** markers for stock exchanges

**CloudRegionMarker –** markers for cloud providers

**LatencyConnection –** animated arcs

**CameraRig –** smooth camera movements

**Tooltip3D –** HTML-based tooltip

**ControlPanel –** filter menu

**Legend –** color label menu

**LatencyPanel –** historical latency chart

### 📧 Submission Guidelines (From Assignment)

- Provide video recording demonstrating functionality and code walk-through

- Include instructions on running the project locally (already included above)

- Submit GitHub repo link

- Attach resume

- Document libraries used + assumptions

- Email to:
  careers@goquant.io

  CC: jennifer.carreno@goquant.io

- Subject line: Lateny Topology Visualizer

### 📄 Assumptions

- Latency is simulated, not fetched from an API

- Globe texture is deliberately simplified for performance

- Data updates occur in intervals (1–1.5s based on device type)

- Historical latency is generated using useLatencyPairs

### 📚 Libraries Used

- three

- @react-three/fiber

- @react-three/drei

- recharts

- next

- typescript

### ⚡ Performance Optimizations

- Dynamic DPR scaling

- Reduced globe segments on mobile

- Limited arc rendering on smaller devices

- Memoization for heavy computations

- Suspense boundaries removed from 3D pipeline

### 👤 Author

**Aqdas Ahmed**

GitHub: https://github.com/AqdasAhmed

Live Link: https://3d-earth-visualizer.vercel.app/