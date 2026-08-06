import { createRouter } from '@tanstack/react-router'
import { Route as rootRoute } from './__root'
import { Route as indexRoute } from './index'
import { Route as dashboardRoute } from './dashboard'
import { Route as patentsRoute } from './patents'
import { Route as fundingRoute } from './funding'
import { Route as publicationsRoute } from './publications'
import { Route as innovationRoute } from './innovation-score'
import { Route as reportsRoute } from './reports'
import { Route as profileRoute } from './profile'
import { Route as collaborationsRoute } from './collaborations'
import { Route as labResourcesRoute } from './lab-resources'
import { Route as alertsRoute } from './alerts'
import { Route as settingsRoute } from './settings'
import { Route as loginRoute } from './login'
import { Route as registerRoute } from './register'

const routeTree = rootRoute.addChildren([
  indexRoute,
  dashboardRoute,
  patentsRoute,
  fundingRoute,
  publicationsRoute,
  innovationRoute,
  reportsRoute,
  profileRoute,
  collaborationsRoute,
  labResourcesRoute,
  alertsRoute,
  settingsRoute,
  loginRoute,
  registerRoute
])

export const router = createRouter({ routeTree })
export default router
