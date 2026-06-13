import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Navigate } from '@tanstack/react-router';
import { useAuth } from '../context/AuthContext.jsx';
import { 
  getAllGabays, 
  createGabay, 
  updateGabay, 
  deleteGabay,
  deleteComment
} from '../api/gabay.js';
import { 
  BookOpen, 
  Heart, 
  Plus, 
  Edit, 
  Trash2, 
  Loader2, 
  X, 
  MessageCircle,
  BarChart3,
  LayoutDashboard
} from 'lucide-react';

export default function AbwaanDashboard() {
  const { user, isAuthenticated, isAbwaan, isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'poems', 'comments'
  const [showModal, setShowModal] = useState(false);
  const [editingPoem, setEditingPoem] = useState(null);
  const [formData, setFormData] = useState({ title: '', content: '' });

  // Fetch all poems
  const { data: gabaysData, isLoading } = useQuery({ queryKey: ['gabays'], queryFn: getAllGabays });

  // Mutations
  const createMutation = useMutation({
    mutationFn: createGabay,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['gabays'] }); closeModal(); },
  });
  const updateMutation = useMutation({
    mutationFn: updateGabay,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['gabays'] }); closeModal(); },
  });
  const deleteMutation = useMutation({
    mutationFn: deleteGabay,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['gabays'] }),
  });
  const deleteCommentMutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['gabays'] }),
  });

  // Route protection (MUST be after all hooks are declared)
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (!isAbwaan && !isAdmin) return <Navigate to="/" />;

  const allPoems = gabaysData || [];
  
  // Filter for ONLY the current Abwaan's poems
  const myPoems = allPoems.filter(poem => poem.author?._id === user?._id);
  const totalLikes = myPoems.reduce((acc, poem) => acc + (poem.likes?.length || 0), 0);
  const totalComments = myPoems.reduce((acc, poem) => acc + (poem.comments?.length || 0), 0);

  // Flatten comments for the new Comments moderation tab
  const allMyComments = myPoems.flatMap(poem => 
    (poem.comments || []).map(comment => ({
      ...comment,
      poemId: poem._id,
      poemTitle: poem.title
    }))
  ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const openCreateModal = () => { setEditingPoem(null); setFormData({ title: '', content: '' }); setShowModal(true); };
  const openEditModal = (poem) => { setEditingPoem(poem); setFormData({ title: poem.title, content: poem.content }); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditingPoem(null); setFormData({ title: '', content: '' }); };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return;
    if (editingPoem) updateMutation.mutate({ id: editingPoem._id, ...formData });
    else createMutation.mutate(formData);
  };

  const handleDelete = (id) => { if (confirm('Are you sure you want to permanently delete this poem?')) deleteMutation.mutate(id); };
  
  const handleDeleteComment = (poemId, commentId) => {
    if (confirm('Are you sure you want to delete this comment from your poem?')) {
      deleteCommentMutation.mutate({ id: poemId, commentId });
    }
  };

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
      <aside className="w-72 border-r border-slate-200 bg-white flex-col hidden md:flex">
        <div className="p-8">
          <p className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6">Poet Dashboard</p>
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-semibold transition-colors cursor-pointer ${
                activeTab === 'overview' ? 'bg-violet-50 text-violet-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard className={`h-5 w-5 ${activeTab === 'overview' ? 'text-violet-600' : 'text-slate-400'}`} />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('poems')}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-semibold transition-colors cursor-pointer ${
                activeTab === 'poems' ? 'bg-violet-50 text-violet-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <BookOpen className={`h-5 w-5 ${activeTab === 'poems' ? 'text-violet-600' : 'text-slate-400'}`} />
              My Portfolio
            </button>
            <button
              onClick={() => setActiveTab('comments')}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-semibold transition-colors cursor-pointer ${
                activeTab === 'comments' ? 'bg-violet-50 text-violet-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <MessageCircle className={`h-5 w-5 ${activeTab === 'comments' ? 'text-violet-600' : 'text-slate-400'}`} />
              Comments
            </button>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 md:p-10">
        
        {/* Mobile Nav */}
        <div className="flex md:hidden border-b border-slate-200 mb-6 gap-6 overflow-x-auto pb-3">
          <button onClick={() => setActiveTab('overview')} className={`text-base font-semibold whitespace-nowrap ${activeTab === 'overview' ? 'text-violet-600' : 'text-slate-500'}`}>Overview</button>
          <button onClick={() => setActiveTab('poems')} className={`text-base font-semibold whitespace-nowrap ${activeTab === 'poems' ? 'text-violet-600' : 'text-slate-500'}`}>My Poems</button>
          <button onClick={() => setActiveTab('comments')} className={`text-base font-semibold whitespace-nowrap ${activeTab === 'comments' ? 'text-violet-600' : 'text-slate-500'}`}>Comments</button>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="mb-10 flex justify-between items-end">
              <div>
                <h1 className="font-display text-4xl font-bold text-slate-900 tracking-tight">Welcome, {user?.username}</h1>
                <p className="text-slate-500 mt-2 text-lg">Here is a summary of your literary journey.</p>
              </div>
              <button onClick={openCreateModal} className="hidden sm:flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-base font-semibold text-white hover:bg-violet-700 transition-colors shadow-sm cursor-pointer">
                <Plus className="h-5 w-5" /> Publish Poem
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold uppercase tracking-wider text-slate-400">Published</span>
                  <BookOpen className="h-6 w-6 text-violet-600" />
                </div>
                <div className="flex items-baseline gap-2 mt-4">
                  <span className="text-4xl font-bold text-slate-900">{myPoems.length}</span>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold uppercase tracking-wider text-slate-400">Total Likes</span>
                  <Heart className="h-6 w-6 text-rose-500" />
                </div>
                <div className="flex items-baseline gap-2 mt-4">
                  <span className="text-4xl font-bold text-slate-900">{totalLikes}</span>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold uppercase tracking-wider text-slate-400">Comments</span>
                  <MessageCircle className="h-6 w-6 text-blue-500" />
                </div>
                <div className="flex items-baseline gap-2 mt-4">
                  <span className="text-4xl font-bold text-slate-900">{totalComments}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'poems' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between mb-8">
              <h1 className="font-display text-3xl font-bold text-slate-900 tracking-tight">My Portfolio</h1>
              <button onClick={openCreateModal} className="flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-base font-semibold text-white hover:bg-violet-700 transition-colors shadow-sm cursor-pointer">
                <Plus className="h-5 w-5" /> Publish Poem
              </button>
            </div>
            
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              {myPoems.length === 0 ? (
                <div className="p-16 text-center">
                  <BookOpen className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 font-medium text-lg">You haven't published any poems yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-500 text-sm font-bold uppercase tracking-wider">
                        <th className="p-5 pl-8">Title</th>
                        <th className="p-5">Published Date</th>
                        <th className="p-5 text-center">Engagement</th>
                        <th className="p-5 text-right pr-8">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {myPoems.map((poem) => (
                        <tr key={poem._id} className="hover:bg-slate-50/40 transition-colors group">
                          <td className="p-5 pl-8">
                            <span className="font-bold text-slate-800 text-base">{poem.title}</span>
                          </td>
                          <td className="p-5 text-slate-500 text-base font-medium">
                            {new Date(poem.createdAt).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </td>
                          <td className="p-5">
                            <div className="flex items-center justify-center gap-5 text-base font-medium text-slate-600">
                              <div className="flex items-center gap-2"><Heart className="h-5 w-5 text-rose-400" />{poem.likes?.length || 0}</div>
                              <div className="flex items-center gap-2"><MessageCircle className="h-5 w-5 text-blue-400" />{poem.comments?.length || 0}</div>
                            </div>
                          </td>
                          <td className="p-5 text-right pr-8 space-x-3">
                            <button onClick={() => openEditModal(poem)} className="text-slate-400 hover:text-violet-600 p-2.5 rounded-lg hover:bg-violet-50 transition-colors cursor-pointer opacity-0 group-hover:opacity-100 inline-flex"><Edit className="h-5 w-5" /></button>
                            <button onClick={() => handleDelete(poem._id)} className="text-slate-400 hover:text-red-600 p-2.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer opacity-0 group-hover:opacity-100 inline-flex"><Trash2 className="h-5 w-5" /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'comments' && (
          <div className="space-y-8">
            <div className="mb-8">
              <h1 className="font-display text-3xl font-bold text-slate-900 tracking-tight">Comment Moderation</h1>
              <p className="text-slate-500 mt-2 text-lg">Read and manage what readers are saying about your poetry.</p>
            </div>
            
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              {allMyComments.length === 0 ? (
                <div className="p-16 text-center">
                  <MessageCircle className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 font-medium text-lg">No comments on your poems yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-500 text-sm font-bold uppercase tracking-wider">
                        <th className="p-5 pl-8">Comment</th>
                        <th className="p-5">Poem</th>
                        <th className="p-5">Reader</th>
                        <th className="p-5 text-right pr-8">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {allMyComments.map((comment) => (
                        <tr key={comment._id} className="hover:bg-slate-50/40 transition-colors group">
                          <td className="p-5 pl-8">
                            <p className="text-slate-800 text-base max-w-md truncate">{comment.content}</p>
                            <span className="text-sm text-slate-400 mt-1 block">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </span>
                          </td>
                          <td className="p-5">
                            <span className="font-semibold text-violet-600 text-base">{comment.poemTitle}</span>
                          </td>
                          <td className="p-5">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm">
                                {comment.author?.username?.charAt(0).toUpperCase() || '?'}
                              </div>
                              <span className="text-slate-700 text-base font-medium">{comment.author?.username || 'Unknown'}</span>
                            </div>
                          </td>
                          <td className="p-5 text-right pr-8">
                            <button 
                              onClick={() => handleDeleteComment(comment.poemId, comment._id)} 
                              className="text-slate-400 hover:text-red-600 p-2.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer opacity-0 group-hover:opacity-100 inline-flex"
                              title="Delete Comment"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

      </main>

      {/* CRUD Poem Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="w-full max-w-3xl rounded-2xl border border-slate-200 bg-white shadow-2xl relative flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-slate-100 px-8 py-6">
              <h3 className="font-display text-2xl font-bold text-slate-900">{editingPoem ? 'Edit Your Poem' : 'Publish New Poem'}</h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer p-2 rounded-lg hover:bg-slate-100"><X className="h-6 w-6" /></button>
            </div>
            
            <div className="p-8 overflow-y-auto">
              <form id="abwaan-poem-form" onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-wider text-slate-500">Poem Title</label>
                  <input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="block w-full rounded-xl border border-slate-200 py-3.5 px-5 text-base text-slate-900 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-wider text-slate-500">Verses / Content</label>
                  <textarea required rows={12} value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} className="block w-full rounded-xl border border-slate-200 py-3.5 px-5 text-base text-slate-900 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 resize-none font-serif leading-relaxed" />
                </div>
              </form>
            </div>
            
            <div className="flex justify-end gap-4 border-t border-slate-100 px-8 py-5 bg-slate-50 rounded-b-2xl">
              <button type="button" onClick={closeModal} className="rounded-xl px-6 py-3 text-base font-semibold text-slate-600 hover:bg-slate-200/50 transition-colors cursor-pointer">Cancel</button>
              <button type="submit" form="abwaan-poem-form" disabled={createMutation.isPending || updateMutation.isPending} className="flex items-center gap-2 rounded-xl bg-violet-600 px-8 py-3 text-base font-semibold text-white hover:bg-violet-700 transition-all shadow-sm shadow-violet-600/20 disabled:opacity-50 cursor-pointer">
                {(createMutation.isPending || updateMutation.isPending) ? <Loader2 className="h-5 w-5 animate-spin" /> : <span>{editingPoem ? 'Update Poem' : 'Publish Poem'}</span>}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
