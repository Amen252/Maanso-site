import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getStats, 
  getAllUsers, 
  updateUserRole, 
  deleteUser, 
  getAllGabays, 
  createGabay, 
  updateGabay, 
  deleteGabay 
} from '../api/admin.js';
import { 
  Users, 
  BookOpen, 
  ShieldAlert, 
  Trash2, 
  Edit, 
  Plus, 
  Loader2, 
  X, 
  TrendingUp,
  UserCheck,
  LayoutDashboard,
  Settings
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { Navigate } from '@tanstack/react-router';

export default function AdminDashboard() {
  const { isAuthenticated, isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'users', 'gabays'
  const [showPoemModal, setShowPoemModal] = useState(false);
  const [editingPoem, setEditingPoem] = useState(null);
  const [poemForm, setPoemForm] = useState({ title: '', content: '', author: '' });

  // 1. Fetch data
  const { data: statsData, isLoading: isLoadingStats } = useQuery({ queryKey: ['adminStats'], queryFn: getStats });
  const { data: usersData, isLoading: isLoadingUsers } = useQuery({ queryKey: ['adminUsers'], queryFn: getAllUsers });
  const { data: gabaysData, isLoading: isLoadingGabays } = useQuery({ queryKey: ['adminGabays'], queryFn: getAllGabays });

  // 2. Mutations
  const roleMutation = useMutation({
    mutationFn: updateUserRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
      queryClient.invalidateQueries({ queryKey: ['adminGabays'] });
    },
  });

  const createPoemMutation = useMutation({
    mutationFn: createGabay,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminGabays'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
      closePoemModal();
    },
  });

  const updatePoemMutation = useMutation({
    mutationFn: updateGabay,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminGabays'] });
      closePoemModal();
    },
  });

  const deletePoemMutation = useMutation({
    mutationFn: deleteGabay,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminGabays'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
    },
  });

  // Route protection
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (!isAdmin) return <Navigate to="/" />;

  const stats = statsData?.data || { totalUsers: 0, totalGabays: 0, roles: { Admin: 0, Abwaan: 0, Viewer: 0 } };
  const users = usersData?.data || [];
  const gabays = gabaysData?.data || [];

  // 3. Handlers
  const handleRoleChange = (id, role) => roleMutation.mutate({ id, role });
  const handleDeleteUser = (id) => { if (confirm('Are you sure you want to delete this user?')) deleteUserMutation.mutate(id); };
  const handleDeletePoem = (id) => { if (confirm('Are you sure you want to delete this poem?')) deletePoemMutation.mutate(id); };

  const openCreateModal = () => {
    setEditingPoem(null);
    setPoemForm({ title: '', content: '', author: users[0]?._id || '' });
    setShowPoemModal(true);
  };

  const openEditModal = (gabay) => {
    setEditingPoem(gabay);
    setPoemForm({ title: gabay.title, content: gabay.content, author: gabay.author?._id || '' });
    setShowPoemModal(true);
  };

  const closePoemModal = () => {
    setShowPoemModal(false);
    setEditingPoem(null);
    setPoemForm({ title: '', content: '', author: '' });
  };

  const handlePoemSubmit = (e) => {
    e.preventDefault();
    if (!poemForm.title.trim() || !poemForm.content.trim()) return;
    if (editingPoem) updatePoemMutation.mutate({ id: editingPoem._id, ...poemForm });
    else createPoemMutation.mutate(poemForm);
  };

  const isLoading = isLoadingStats || isLoadingUsers || isLoadingGabays;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-5rem)] bg-slate-50 gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-violet-600" />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-5rem)] bg-slate-50 overflow-hidden">
      
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-200 bg-white flex-col hidden md:flex">
        <div className="p-6">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Admin Panel</p>
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                activeTab === 'overview' ? 'bg-violet-50 text-violet-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard className={`h-4.5 w-4.5 ${activeTab === 'overview' ? 'text-violet-600' : 'text-slate-400'}`} />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                activeTab === 'users' ? 'bg-violet-50 text-violet-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Users className={`h-4.5 w-4.5 ${activeTab === 'users' ? 'text-violet-600' : 'text-slate-400'}`} />
              User Management
            </button>
            <button
              onClick={() => setActiveTab('gabays')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                activeTab === 'gabays' ? 'bg-violet-50 text-violet-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <BookOpen className={`h-4.5 w-4.5 ${activeTab === 'gabays' ? 'text-violet-600' : 'text-slate-400'}`} />
              Poem Moderation
            </button>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 md:p-8">
        
        {/* Mobile Nav (Visible only on small screens) */}
        <div className="flex md:hidden border-b border-slate-200 mb-6 gap-4 overflow-x-auto pb-2">
          <button onClick={() => setActiveTab('overview')} className={`text-sm font-semibold whitespace-nowrap ${activeTab === 'overview' ? 'text-violet-600' : 'text-slate-500'}`}>Overview</button>
          <button onClick={() => setActiveTab('users')} className={`text-sm font-semibold whitespace-nowrap ${activeTab === 'users' ? 'text-violet-600' : 'text-slate-500'}`}>Users</button>
          <button onClick={() => setActiveTab('gabays')} className={`text-sm font-semibold whitespace-nowrap ${activeTab === 'gabays' ? 'text-violet-600' : 'text-slate-500'}`}>Poems</button>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="mb-8">
              <h1 className="font-display text-3xl font-bold text-slate-900 tracking-tight">System Overview</h1>
              <p className="text-slate-500 mt-1">High-level metrics and platform health.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Users</span>
                  <Users className="h-5 w-5 text-violet-600" />
                </div>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-bold text-slate-900">{stats.totalUsers}</span>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Poems</span>
                  <BookOpen className="h-5 w-5 text-fuchsia-600" />
                </div>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-bold text-slate-900">{stats.totalGabays}</span>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Poets (Abwaans)</span>
                  <UserCheck className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-bold text-slate-900">{stats.roles.Abwaan}</span>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Administrators</span>
                  <ShieldAlert className="h-5 w-5 text-rose-600" />
                </div>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-bold text-slate-900">{stats.roles.Admin}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="mb-6">
              <h1 className="font-display text-2xl font-bold text-slate-900 tracking-tight">User Management</h1>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                      <th className="p-4 pl-6">Username</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Role</th>
                      <th className="p-4 text-right pr-6">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {users.map((u) => (
                      <tr key={u._id} className="hover:bg-slate-50/40 transition-colors group">
                        <td className="p-4 pl-6 font-semibold text-slate-900">{u.username}</td>
                        <td className="p-4 text-slate-500 text-sm">{u.email}</td>
                        <td className="p-4">
                          <select
                            value={u.role}
                            onChange={(e) => handleRoleChange(u._id, e.target.value)}
                            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 focus:border-violet-500 outline-none transition-colors cursor-pointer"
                          >
                            <option value="Viewer">Viewer</option>
                            <option value="Abwaan">Abwaan</option>
                            <option value="Admin">Admin</option>
                          </select>
                        </td>
                        <td className="p-4 text-right pr-6">
                          <button
                            onClick={() => handleDeleteUser(u._id)}
                            className="text-slate-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'gabays' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="font-display text-2xl font-bold text-slate-900 tracking-tight">Poem Moderation</h1>
              <button
                onClick={openCreateModal}
                className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 transition-colors shadow-sm cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Create Poem</span>
              </button>
            </div>
            
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                      <th className="p-4 pl-6">Title</th>
                      <th className="p-4">Author</th>
                      <th className="p-4">Date</th>
                      <th className="p-4 text-right pr-6">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {gabays.map((g) => (
                      <tr key={g._id} className="hover:bg-slate-50/40 transition-colors group">
                        <td className="p-4 pl-6 font-semibold text-slate-900">{g.title}</td>
                        <td className="p-4 text-slate-500 text-sm">{g.author?.username || 'Unknown'}</td>
                        <td className="p-4 text-slate-500 text-sm">{new Date(g.createdAt).toLocaleDateString()}</td>
                        <td className="p-4 text-right pr-6 space-x-2">
                          <button
                            onClick={() => openEditModal(g)}
                            className="text-slate-400 hover:text-violet-600 p-2 rounded-lg hover:bg-violet-50 transition-colors cursor-pointer opacity-0 group-hover:opacity-100 inline-flex"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeletePoem(g._id)}
                            className="text-slate-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors cursor-pointer opacity-0 group-hover:opacity-100 inline-flex"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* CRUD Poem Modal */}
      {showPoemModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-2xl relative flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h3 className="font-display text-xl font-bold text-slate-900">
                {editingPoem ? 'Edit Poem' : 'Create Poem'}
              </h3>
              <button onClick={closePoemModal} className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer p-1 rounded-lg hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form id="admin-poem-form" onSubmit={handlePoemSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Poem Title</label>
                  <input type="text" required value={poemForm.title} onChange={(e) => setPoemForm({ ...poemForm, title: e.target.value })} className="block w-full rounded-xl border border-slate-200 py-3 px-4 text-sm text-slate-900 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Author</label>
                  <select value={poemForm.author} onChange={(e) => setPoemForm({ ...poemForm, author: e.target.value })} className="block w-full rounded-xl border border-slate-200 py-3 px-4 text-sm text-slate-900 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500">
                    {users.map((u) => <option key={u._id} value={u._id}>{u.username}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Content</label>
                  <textarea required rows={8} value={poemForm.content} onChange={(e) => setPoemForm({ ...poemForm, content: e.target.value })} className="block w-full rounded-xl border border-slate-200 py-3 px-4 text-sm text-slate-900 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 resize-none font-serif" />
                </div>
              </form>
            </div>
            
            <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4 bg-slate-50 rounded-b-2xl">
              <button type="button" onClick={closePoemModal} className="rounded-xl px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-200/50 transition-colors cursor-pointer">Cancel</button>
              <button type="submit" form="admin-poem-form" disabled={createPoemMutation.isPending || updatePoemMutation.isPending} className="flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 transition-all shadow-sm shadow-violet-600/20 disabled:opacity-50 cursor-pointer">
                {(createPoemMutation.isPending || updatePoemMutation.isPending) ? <Loader2 className="h-4 w-4 animate-spin" /> : <span>Save</span>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
