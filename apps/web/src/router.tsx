import { createRootRoute, createRoute, createRouter, Outlet } from '@tanstack/react-router';
import { AuthLayout } from './layouts/AuthLayout';
import { PublicLayout } from './layouts/PublicLayout';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { NewProjectPage } from './pages/NewProjectPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { RegisterPage } from './pages/RegisterPage';

// Bare root — child layout routes handle their own shell
const rootRoute = createRootRoute({ component: Outlet, notFoundComponent: NotFoundPage });

// Public pages — Header + main + Footer
const publicLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'public-layout',
  component: () => (
    <PublicLayout>
      <Outlet />
    </PublicLayout>
  ),
});

// Auth pages — Header + two-panel, no Footer
const authLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'auth-layout',
  component: AuthLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: '/',
  component: HomePage,
});

const projectsRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: '/projects',
  component: ProjectsPage,
});

const newProjectRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: '/projects/new',
  component: NewProjectPage,
});

const loginRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/login',
  component: LoginPage,
});

const registerRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/register',
  component: RegisterPage,
});

const routeTree = rootRoute.addChildren([
  publicLayoutRoute.addChildren([indexRoute, projectsRoute, newProjectRoute]),
  authLayoutRoute.addChildren([loginRoute, registerRoute]),
]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
