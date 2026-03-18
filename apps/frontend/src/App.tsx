import { Router } from '@solidjs/router'
import { Suspense, type Component } from 'solid-js'
import { Toaster } from 'solid-toast'

import Header from './components/Header'
import routes from './routes'

const App: Component = () => {
  return (
    <Suspense fallback={'loading'}>
      <Router
        root={(props) => (
          <div class="min-h-screen bg-gray-100">
            <Toaster />
            <Header />
            <main class="container mx-auto px-4 py-8">{props.children}</main>
          </div>
        )}
      >
        {routes}
      </Router>
    </Suspense>
  )
}

export default App
