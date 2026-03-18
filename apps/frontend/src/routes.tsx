import type { RouteDefinition } from '@solidjs/router'
import { lazy } from 'solid-js'

const Home = lazy(() => import('./screens/Home'))
const Application = lazy(() => import('./screens/Application'))

const routes: RouteDefinition[] = [
  {
    path: '/',
    component: Home,
    children: []
  },
  {
    path: '/application/:id',
    component: Application
  }
]

export default routes
