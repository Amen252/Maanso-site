import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, Link } from '@tanstack/react-router';
import { login as loginApi } from '../api/auth.js';
import { useAuth } from '../context/AuthContext.jsx';
import { Mail, Lock, Loader2, AlertCircle } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');

  const loginMutation = useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      login(data.accessToken, data.user);
      if (data.user?.role === 'Admin') {
        navigate({ to: '/admin' });
      } else {
        navigate({ to: '/' });
      }
    },
    onError: (error) => {
      setErrorMessage(
        error.response?.data?.message || 'Login failed. Please check your credentials.'
      );
    },
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    loginMutation.mutate(formData);
  };

  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-slate-50 p-4 sm:p-6 lg:p-8">
      
      <div className="flex w-full max-w-[950px] bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        
        {/* Left Side: Solid Violet Block */}
        <div className="hidden md:flex md:w-[45%] bg-gradient-to-br from-violet-600 to-fuchsia-600 p-10 flex-col justify-center text-white relative">
          {/* Subtle background texture/pattern */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
          
          <div className="relative z-10 pr-4">
            <p className="text-xs font-bold tracking-widest text-violet-200 mb-3 uppercase">
              Welcome Back
            </p>
            <h2 className="text-3xl lg:text-4xl font-bold leading-tight mb-6">
              Dive into the rich tradition of Somali poetry
            </h2>
            <p className="text-violet-100 text-sm leading-relaxed font-medium mb-4">
              "Rag waa raggii hore, hadalna waa intuu yidhi."
              <br/>
              <span className="opacity-80 mt-1 block font-normal">- Classical Somali Proverb</span>
            </p>
            <p className="text-violet-200 text-sm mt-8">
              Connect with Abwaans and explore our growing collection of classical and modern poetry.
            </p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-[55%] p-8 sm:p-12 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 tracking-tight">Welcome back!</h2>
          
          <form className="space-y-4" onSubmit={handleSubmit}>
            {errorMessage && (
              <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600 mb-4">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-4.5 w-4.5 text-slate-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email address"
                  className="block w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-4.5 w-4.5 text-slate-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="block w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loginMutation.isPending}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 text-base font-semibold text-white hover:bg-violet-700 transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
              >
                {loginMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Logging in...</span>
                  </>
                ) : (
                  <span>Log in</span>
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center text-sm">
            <span className="text-slate-500">Don't have an account yet? </span>
            <Link to="/register" className="font-semibold text-violet-600 hover:text-violet-700 transition-colors">
              Create an account
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
