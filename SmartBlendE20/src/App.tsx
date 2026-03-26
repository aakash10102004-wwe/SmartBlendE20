import { lazy, Suspense, Component, type ReactNode } from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Hero from './components/showcase/Hero';
import Features from './components/showcase/Features';
import Benefits from './components/showcase/Benefits';
import HowItWorks from './components/showcase/HowItWorks';
import TechSpecs from './components/showcase/TechSpecs';

// Lazy-load the 3D viewer so Three.js import failures don't crash the rest of the app
const ModelViewer = lazy(() => import('./components/showcase/ModelViewer'));

/* ── Error boundary – catches WebGL / Three.js crashes ── */
class ModelBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: Error) {
    console.warn('[ModelViewer] crashed:', error.message);
  }
  render() {
    if (this.state.hasError) {
      return (
        <section
          style={{
            padding: '80px 24px',
            textAlign: 'center',
            color: '#9e9eb8',
          }}
        >
          <p style={{ fontSize: '1.1rem', fontWeight: 600, color: '#f0f0f5' }}>
            3D Viewer could not load
          </p>
          <p style={{ marginTop: 8 }}>
            Please use a browser that supports WebGL (Chrome, Edge, Firefox).
          </p>
        </section>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Features />
        <Benefits />
        <HowItWorks />
        <TechSpecs />
        <ModelBoundary>
          <Suspense
            fallback={
              <section
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 400,
                  color: '#9e9eb8',
                }}
              >
                Loading 3D Viewer…
              </section>
            }
          >
            <ModelViewer />
          </Suspense>
        </ModelBoundary>
      </main>
      <Footer />
    </>
  );
}

export default App;
