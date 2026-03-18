import type { Component } from 'solid-js'

import Comp from './Comp'

const App: Component = () => {
  return (
    <>
      <p class="text-4xl text-green-700 text-center py-20">Hello tailwind!</p>
      <Comp />
    </>
  )
}

export default App
