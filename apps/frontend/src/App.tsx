import { Router } from '@solidjs/router'
import { Suspense, type Component } from 'solid-js'
import { Toaster } from 'solid-toast'

import Header from './components/Header'
import routes from './routes'

const App: Component = () => {
  return (
    <Router
      root={(props) => (
        <>
          <div class="relative z-1 min-h-screen bg-slate-950/80">
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: '#1a1f3c',
                  color: '#fff',
                  border: '1px solid #2a2f4c'
                }
              }}
            />

            <Suspense
              fallback={
                <div class="min-h-screen bg-slate-950 flex items-center justify-center">
                  <div class="text-sky-400 text-lg font-medium">
                    Chargement...
                  </div>
                </div>
              }
            >
              <Header />
              <main class=" max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                {props.children}
              </main>
            </Suspense>
          </div>
          <video
            role="presentation"
            autoplay=""
            muted=""
            playsinline=""
            loop=""
            src="/bg-credit-pradeo.mp4"
            class="z-0 absolute top-0 left-0 w-full h-full object-cover"
          />
        </>
      )}
    >
      {routes}
    </Router>
  )
}

export default App
