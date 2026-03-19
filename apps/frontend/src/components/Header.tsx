import { A } from '@solidjs/router'
import type { Component } from 'solid-js'

const Header: Component = () => {
  return (
    <header class="bg-black shadow">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <A href="/" class="text-xl font-bold text-emerald-300">
            Pradeo Security Scanner
          </A>
          <nav>
            <A href="/" class="text-slate-400 hover:text-slate-500 mx-4">
              Accueil
            </A>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header
