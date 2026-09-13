# 🏎️ DODGE CHALLENGER SRT® HELLCAT — 360° Interactive Experience

A luxury, high-performance automotive web experience showcasing the Dodge Challenger SRT® Hellcat with an ultra-responsive 360-degree scroll animation engine, technical blueprint anatomy, telemetry dashboards, real-time vehicle configurator, and 3D customer review marquees.

---

## ⚡ Live Highlights & Features

- **🎮 360° Physics-Driven Scroll Hero**:
  - 300-frame high-resolution cinematic rotation synchronized smoothly with page scroll.
  - Zero-allocation RAF ticker running at 120 FPS with momentum physics easing.
  - Native 1920×1080 GPU canvas buffer with smart nearest-frame fallback for instant zero-lag rendering.
- **📐 Interactive Car Anatomy (The Machine, Up Close)**:
  - Technical engineering blueprint grid with precision coordinates and crosshairs.
  - 6 interactive exploration nodes (Signature Grille, Performance Lighting, Sculpted Widebody, Brembo® 6-Piston Wheels, SRT Cockpit, Active Valve Exhaust).
  - Hover & click triggers with auto-dismissing telemetry callout cards.
- **📊 Live Performance Telemetry Deck**:
  - Real-time animated counters: **797 HP**, **3.4s 0–60 MPH**, **203 MPH Top Speed**, **707 LB-FT Torque**.
  - Dynamic gauge meters triggered by an optimized IntersectionObserver.
- **🎨 3D Showroom Configurator ("Make It Yours")**:
  - Real-time exterior color selector switching between high-resolution studio showroom renders:
    - *Pitch Black*
    - *Bright White*
    - *TorRed Clearcoat*
    - *Granite Crystal Metallic*
  - Interactive Wheel and Interior leather selection with live pricing calculations and summary specifications.
- **💬 3D Perspective Customer Reviews Marquee**:
  - Dual-track infinite 3D perspective marquee with authentic customer reviews and driver ratings.
- **📑 Full Mechanical Specifications & Dealership Modals**:
  - Interactive modal dialogs for booking test drives, requesting custom quotes, and viewing complete powertrain blueprints.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Core** | Semantic HTML5, Vanilla JavaScript (ES6+), Modern Vanilla CSS |
| **Animation & Rendering** | HTML5 2D Canvas Engine, `requestAnimationFrame`, CSS 3D Transforms |
| **Typography** | `Cabinet Grotesk` (Display), `Inter` (Body), `JetBrains Mono` (Telemetry) |
| **Styling Architecture** | Custom HSL Token Design System (Graphite, Metallic Charcoal, Crimson Accent) |
| **Deployment** | Vercel (Edge CDN with optimized immutable caching) |

---

## 🚀 Getting Started Locally

### Prerequisites
You only need any local static server (or Python / Node.js).

### Running with Python:
```bash
python -m http.server 8080
```
Open [http://localhost:8080](http://localhost:8080) in your browser.

### Running with Node.js (`npx serve`):
```bash
npx serve .
```

---

## 🌐 Deploying to Vercel

This repository includes a production-ready `vercel.json` with optimized edge caching headers for all 300 frame assets and static bundles.

### Option 1: Vercel CLI
```bash
npx vercel
```

### Option 2: GitHub Integration (Automatic)
1. Push this repository to GitHub.
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your **`Dodge`** repository.
4. Keep the default settings (Framework Preset: **Other**) and click **Deploy**.
5. Your site will be live instantly with global CDN caching.

---

## 📁 Repository Structure

```
.
├── index.html                  # Main application structure and sections
├── style.css                   # Complete design system, layouts, and animations
├── script.js                   # 360° canvas engine, configurator & observers
├── vercel.json                 # Vercel deployment & immutable cache rules
├── .gitignore                  # Git clean repository ignore rules
├── challenger-black.jpg        # Studio showroom render (Pitch Black)
├── challenger-white.jpg        # Studio showroom render (Bright White)
├── challenger-red.jpg          # Studio showroom render (TorRed)
├── challenger-grey.jpg         # Studio showroom render (Granite Crystal)
├── ezgif-frame-001.png ...     # 300-frame 360° rotation sequence (frames 1–300)
└── README.md                   # Project documentation
```

---

## 🏎️ Performance Optimizations

- **Instant Frame Rendering**: Canvas decodes frames directly to an offscreen buffer, preventing main-thread layout recalculations.
- **Zero CLS (Cumulative Layout Shift)**: Explicit aspect ratios and hardware-accelerated transforms (`translateZ(0)`, `will-change`).
- **Edge Cache Headers**: Images cached with `Cache-Control: public, max-age=31536000, immutable` for lightning-fast subsequent loads on Vercel.

---

## 📄 License

MIT License. Designed and engineered for automotive enthusiasts and high-performance web experience showcases.
