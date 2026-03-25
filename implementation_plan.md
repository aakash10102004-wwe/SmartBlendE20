# Smart Blend E20 — Implementation Plan (Optimized)

Frontend-only web app demonstrating an intelligent E20 fuel filtration system with:
- Product showcase
- Interactive 3D model
- Mobile-style dashboard
- Simulated IoT data

---

## 1. Tech Stack

- React + Vite (TypeScript)
- Tailwind CSS
- React Three Fiber + Drei
- Framer Motion
- Recharts
- Zustand

---

## 2. Project Structure

src/
  components/
    showcase/
    model/
    dashboard/
    ui/
  hooks/
  data/
  styles/
  App.tsx

---

## 3. Landing Page (Showcase)

Sections:
- Hero (title, subtitle, CTA buttons)
- Features (3–4 cards)
- Benefits (mileage, safety, efficiency)
- How It Works (4 steps)
- Tech Specs
- Placeholder for 3D model

Design:
- Dark theme
- Glassmorphism cards
- Smooth scroll animations

---

## 4. 3D Model Viewer

Component: FuelChamber3D

- Use React Three Fiber
- OrbitControls (rotate, zoom, pan)
- Basic chamber structure using primitives:
  - Cylinder (outer body)
  - Mesh (filter)
  - Plates (capacitive grid)
  - Pins (water sensor)
  - Sphere (thermistor)

Interactions:
- Hover → highlight
- Click → show label (Html overlay)

Add:
- Ambient + directional light
- Floating animation
- Suspense loader

---

## 5. Dashboard System

Component: DashboardShell

Tabs:
- Dashboard
- Insights
- Alerts
- Services

### Dashboard Tab
- Vehicle info
- Fuel status (color badge)
- Mileage improvement
- Engine health
- Efficiency score

### Insights Tab
- Mileage comparison
- Fuel savings
- Water removal %
- Simple chart

### Alerts Tab
- Alert list (title + time)
- Status tags (Active / Filtering / Resolved)
- Recommendations

### Services Tab
- Subscription plan
- Status
- AMC validity
- Service button (UI only)

---

## 6. IoT Simulation

Hook: useSensorData

Update every 2 seconds:
- Ethanol: 70–100%
- Water: 0–5%
- Temperature: 25–40°C
- Efficiency: calculated

Add slight randomness + spikes

---

## 7. Alert System

Hook: useAlerts

Trigger:
- Water > 1% → contamination alert
- Temp > 38°C → overheating
- Efficiency < 70 → low efficiency

Features:
- Store last 10 alerts
- Timestamp each alert
- Show in Alerts tab
- Toast notifications
- Status transitions

---

## 8. UI System

- Glass cards
- Rounded corners
- Smooth animations
- Responsive layout
- Bottom nav (mobile)

---

## 9. Performance

- Lazy load 3D model
- Use Suspense fallback
- Optimize re-renders

---

## 10. Goal

Final app should feel like:
- Real IoT product demo
- Interactive + dynamic
- Clean and premium UI