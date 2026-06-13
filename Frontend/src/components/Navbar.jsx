import React from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useAuth } from '../context/AuthContext.jsx';
import { Feather, LogOut, ChevronDown, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const { user, logout, isAuthenticated, isAdmin, isAbwaan } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate({ to: '/login' });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-8 lg:px-12">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center group">
          <span className="font-display text-2xl font-bold tracking-tight text-slate-900 group-hover:text-violet-600 transition-colors">
            Maanso
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-8">
          <Link
            to="/"
            className="text-base font-medium text-slate-600 hover:text-violet-600 transition-colors"
            activeProps={{ className: '!text-violet-600' }}
          >
            Poems
          </Link>

          <Link
            to="/poets"
            className="text-base font-medium text-slate-600 hover:text-violet-600 transition-colors"
            activeProps={{ className: '!text-violet-600' }}
          >
            Poets
          </Link>

          <Link
            to="/about"
            className="text-base font-medium text-slate-600 hover:text-violet-600 transition-colors"
            activeProps={{ className: '!text-violet-600' }}
          >
            About
          </Link>

          <div className="h-5 w-px bg-slate-200" />

          {/* Authentication State */}
          {isAuthenticated ? (
            <div className="relative group">
              <button className="flex items-center gap-1.5 py-1.5 text-base font-medium text-slate-600 hover:text-violet-600 transition-colors cursor-pointer">
                <span>{user?.username}</span>
                <ChevronDown className="h-4.5 w-4.5 text-slate-400 group-hover:text-violet-600 transition-colors" />
              </button>

              {/* Dropdown Menu */}
              <div className="absolute right-0 top-full mt-3 w-56 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 ease-out z-50">
                <div className="rounded-2xl border border-slate-100 bg-white p-2 shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex flex-col gap-1">
                  
                  <div className="px-3 py-2 border-b border-slate-50 mb-1 block sm:hidden">
                    <span className="text-xs text-slate-500 block">Signed in as</span>
                    <span className="text-sm font-bold text-slate-800">{user?.username}</span>
                  </div>

                  <Link
                    to="/"
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-violet-600 transition-colors"
                  >
                    <Feather className="h-4 w-4" />
                    <span>My Profile</span>
                  </Link>

                  {(isAdmin || isAbwaan) && (
                    <Link
                      to={isAdmin ? '/admin' : '/dashboard'}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-violet-50 hover:text-violet-600 transition-colors"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      <span>{isAdmin ? 'Admin Dashboard' : 'Poet Dashboard'}</span>
                    </Link>
                  )}

                  <div className="h-px bg-slate-50 my-1 mx-2" />

                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign out</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-5">
              <Link
                to="/login"
                className="text-base font-semibold text-slate-600 hover:text-violet-600 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-xl bg-violet-600 px-5 py-2.5 text-base font-semibold text-white hover:bg-violet-700 shadow-sm shadow-violet-600/10 hover:shadow-violet-600/25 transition-all"
              >
                Get started
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
