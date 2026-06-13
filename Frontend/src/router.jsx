import React from 'react';
import { 
  createRootRoute, 
  createRoute, 
  createRouter, 
  Outlet,
  Link
} from '@tanstack/react-router';
import Navbar from './components/Navbar.jsx';
import GabayFeed from './pages/GabayFeed.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import AbwaanDashboard from './pages/AbwaanDashboard.jsx';
import About from './pages/About.jsx';
import Poets from './pages/Poets.jsx';
import GabayDetail from './pages/GabayDetail.jsx';
import { Twitter, Instagram, Facebook, Github } from 'lucide-react';

// 1. Define the Root Route Layout
const RootComponent = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <footer className="bg-[#2b3db6] text-blue-50 py-16 border-t border-[#2637a7]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Top Section: Brand + Links */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12">
            {/* Brand / Logo */}
            <div className="md:col-span-4 flex flex-col gap-4">
              <div className="flex items-center gap-2.5">
                <div className="h-7 w-7 rounded-full bg-white flex items-center justify-center font-bold text-[#2b3db6] text-sm shadow-sm">
                  M
                </div>
                <span className="font-display text-xl font-bold text-white tracking-tight">Maanso</span>
              </div>
            </div>

            {/* Link Column 1: Platform */}
            <div className="md:col-span-2 md:col-start-7 flex flex-col gap-4">
              <span className="text-xs font-bold text-blue-200 uppercase tracking-wider">Platform</span>
              <div className="flex flex-col gap-3 text-sm font-medium">
                <Link to="/" className="hover:text-white transition-colors">Feed</Link>
                <Link to="/poets" className="hover:text-white transition-colors">Abwaans</Link>
                <Link to="/about" className="hover:text-white transition-colors">About Us</Link>
              </div>
            </div>

            {/* Link Column 2: Resources */}
            <div className="md:col-span-2 flex flex-col gap-4">
              <span className="text-xs font-bold text-blue-200 uppercase tracking-wider">Resources</span>
              <div className="flex flex-col gap-3 text-sm font-medium">
                <a href="#" className="hover:text-white transition-colors">Somali Literature</a>
                <a href="#" className="hover:text-white transition-colors">Poetry Guide</a>
                <a href="#" className="hover:text-white transition-colors">Community</a>
              </div>
            </div>

            {/* Link Column 3: Legal & Social */}
            <div className="md:col-span-2 flex flex-col gap-4">
              <span className="text-xs font-bold text-blue-200 uppercase tracking-wider">Connect</span>
              <div className="flex flex-col gap-3 text-sm font-medium">
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors inline-flex items-center gap-2">
                  <Twitter className="h-4 w-4 shrink-0" /> Twitter
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors inline-flex items-center gap-2">
                  <Instagram className="h-4 w-4 shrink-0" /> Instagram
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors inline-flex items-center gap-2">
                  <Facebook className="h-4 w-4 shrink-0" /> Facebook
                </a>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors inline-flex items-center gap-2">
                  <Github className="h-4 w-4 shrink-0" /> GitHub
                </a>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-white/10 my-8"></div>

          {/* Bottom Section: Tagline + Copyright */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h4 className="font-bold text-white text-base">Maanso: The Somali Literature Hub</h4>
              <p className="text-xs text-blue-105 mt-1">
                Discover, read, and preserve Somali poetry for generations to come.
              </p>
            </div>
            <p className="text-xs text-blue-200 font-medium">
              &copy; {new Date().getFullYear()} Maanso. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const rootRoute = createRootRoute({
  component: RootComponent,
});

// 2. Define Child Routes
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: GabayFeed,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: About,
});

const poetsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/poets',
  component: Poets,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: Login,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: Register,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminDashboard,
});

const abwaanDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: AbwaanDashboard,
});

const gabayDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/gabays/$id',
  component: GabayDetail,
});

// 3. Create Route Tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  aboutRoute,
  poetsRoute,
  loginRoute,
  registerRoute,
  adminRoute,
  abwaanDashboardRoute,
  gabayDetailRoute,
]);

// 4. Create and export the Router instance
export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
});
