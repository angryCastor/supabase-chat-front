import { routes as homeRoutes } from './home'
import { routes as authRoutes } from './auth'

const routes = [...homeRoutes, ...authRoutes]

export { routes }
