import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllUsers } from '../api/admin.js';
import { Loader2, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Poets() {
  const { isAuthenticated } = useAuth();
  
  const { data: response, isLoading } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: getAllUsers,
    enabled: isAuthenticated, // Only fetch if logged in (admin endpoint might require auth, wait, actually let's just handle it gracefully)
  });

  const users = response?.data || [];
  const poets = users.filter(u => u.role === 'Abwaan' || u.role === 'Admin');

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 bg-slate-50 min-h-screen text-center">
        <h2 className="text-2xl font-bold text-slate-900">Please sign in to view the poets directory.</h2>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 bg-slate-50 min-h-screen">
      <div className="mb-8">
        <h1 className="font-display text-4xl font-extrabold text-slate-900 tracking-tight">
          Featured Poets (Abwaano)
        </h1>
        <p className="mt-2 text-slate-600">Discover the voices behind the poetry.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {poets.map(poet => (
            <div key={poet._id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center font-bold text-xl">
                {poet.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">{poet.username}</h3>
                <span className="text-xs font-medium bg-violet-50 text-violet-600 px-2 py-0.5 rounded border border-violet-100">
                  {poet.role}
                </span>
              </div>
            </div>
          ))}
          {poets.length === 0 && (
            <p className="text-slate-500 col-span-3">No poets found.</p>
          )}
        </div>
      )}
    </div>
  );
}
