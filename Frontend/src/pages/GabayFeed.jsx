import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { getAllGabays, createGabay, toggleLike, addComment, deleteComment } from '../api/gabay.js';
import { useAuth } from '../context/AuthContext.jsx';
import HeroImg from '../assets/Hero.png';
import {
  Heart,
  MessageSquare,
  Plus,
  Search,
  Trash2,
  User as UserIcon,
  X,
  Send,
  AlertCircle,
  Loader2,
  Calendar,
  PenTool,
  LayoutGrid,
  List
} from 'lucide-react';

export default function GabayFeed() {
  const queryClient = useQueryClient();
  const { user, isAuthenticated, isAbwaan, isAdmin } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPoem, setNewPoem] = useState({ title: '', content: '' });
  const [commentInputs, setCommentInputs] = useState({});
  const [expandedComments, setExpandedComments] = useState({});

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [viewMode, setViewMode] = useState('compact');

  // Fetch all poems
  const { data: gabays = [], isLoading, isError, error } = useQuery({
    queryKey: ['gabays'],
    queryFn: getAllGabays,
  });

  // Create poem mutation
  const createMutation = useMutation({
    mutationFn: createGabay,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gabays'] });
      setNewPoem({ title: '', content: '' });
      setShowAddModal(false);
    },
  });

  // Toggle like mutation
  const likeMutation = useMutation({
    mutationFn: toggleLike,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gabays'] });
    },
  });

  // Add comment mutation
  const commentMutation = useMutation({
    mutationFn: addComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gabays'] });
    },
  });

  // Delete comment mutation
  const deleteCommentMutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gabays'] });
    },
  });

  const handleCreatePoem = (e) => {
    e.preventDefault();
    if (!newPoem.title.trim() || !newPoem.content.trim()) return;
    createMutation.mutate(newPoem);
  };

  const handleToggleLike = (gabayId) => {
    if (!isAuthenticated) return alert('Please log in to like poems.');
    likeMutation.mutate(gabayId);
  };

  const handleAddComment = (e, gabayId) => {
    e.preventDefault();
    if (!isAuthenticated) return alert('Please log in to comment.');
    const content = commentInputs[gabayId];
    if (!content || !content.trim()) return;

    commentMutation.mutate({ id: gabayId, content });
    setCommentInputs({ ...commentInputs, [gabayId]: '' });
  };

  const handleDeleteComment = (gabayId, commentId) => {
    if (confirm('Are you sure you want to delete this comment?')) {
      deleteCommentMutation.mutate({ id: gabayId, commentId });
    }
  };

  const toggleCommentsExpansion = (gabayId) => {
    setExpandedComments({
      ...expandedComments,
      [gabayId]: !expandedComments[gabayId]
    });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const filteredGabays = gabays.filter(gabay => {
    const titleMatch = gabay.title.toLowerCase().includes(searchQuery.toLowerCase());
    const contentMatch = gabay.content.toLowerCase().includes(searchQuery.toLowerCase());
    const authorMatch = gabay.author?.username?.toLowerCase().includes(searchQuery.toLowerCase());
    return titleMatch || contentMatch || authorMatch;
  });

  const totalPages = Math.ceil(filteredGabays.length / itemsPerPage);
  const paginatedGabays = filteredGabays.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const canPublish = isAuthenticated && (isAbwaan || isAdmin);

  return (
    <div className="w-full bg-slate-50 min-h-screen">

      {/* Hero Section */}
      <section className="hero w-full pt-8 md:pt-10 mb-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl shadow-lg ring-1 ring-slate-200/60">
            <img
              src={HeroImg}
              alt="Somali coastal landscape"
              className="w-full h-[320px] sm:h-[380px] md:h-[460px] lg:h-[520px] object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-slate-950/40 to-transparent"></div>
            <div className="absolute inset-0 flex items-center">
              <div className="px-6 sm:px-10 md:px-12 max-w-xl">
                <p className="text-sky-200 text-xs sm:text-sm font-semibold uppercase tracking-wider mb-3">
                  Preserve Our Heritage
                </p>
                <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-normal tracking-tight leading-tight text-white">
                  Where Somali poetry meets the world
                </h1>
                <p className="mt-4 text-slate-200 text-sm sm:text-base leading-relaxed">
                  From classical Gabay to modern verses — discover voices, stories, and traditions carried across generations.
                </p>

                <div className="flex flex-wrap items-center gap-3 mt-6">
                  <button
                    onClick={() => {
                      const searchEl = document.querySelector('input[placeholder*="Search poems"]');
                      if (searchEl) searchEl.focus();
                    }}
                    className="px-5 py-2.5 bg-white text-slate-900 hover:bg-slate-100 font-semibold rounded-xl text-sm shadow-sm transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Start Reading
                  </button>
                  {canPublish && (
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="flex items-center gap-2 rounded-xl border border-white/40 bg-white/10 hover:bg-white/20 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Publish Poem</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-8 sm:gap-10 w-full max-w-md mt-8 pt-8 border-t border-white/25">
                  <div>
                    <div className="text-2xl md:text-3xl font-light text-white">{gabays.length || 0}</div>
                    <div className="text-xs text-slate-300 font-semibold uppercase tracking-wider mt-1">Poems</div>
                  </div>
                  <div>
                    <div className="text-2xl md:text-3xl font-light text-white">
                      {new Set(gabays.map(g => g.author?._id).filter(Boolean)).size || 1}
                    </div>
                    <div className="text-xs text-slate-300 font-semibold uppercase tracking-wider mt-1">Abwaans</div>
                  </div>
                  <div>
                    <div className="text-2xl md:text-3xl font-light text-white">
                      {gabays.reduce((acc, curr) => acc + (curr.likes?.length || 0), 0)}
                    </div>
                    <div className="text-xs text-slate-300 font-semibold uppercase tracking-wider mt-1">Likes</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area (Constrained width) */}
      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">

        {/* Search and Filters */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-grow">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search poems by title, content, or Abwaan..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="block w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20 shadow-sm transition-all"
            />
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center border border-slate-200 bg-white rounded-2xl p-1 shadow-sm shrink-0">
            <button
              onClick={() => setViewMode('feed')}
              className={`p-2.5 rounded-xl transition-all cursor-pointer ${viewMode === 'feed'
                  ? 'bg-violet-50 text-violet-650'
                  : 'text-slate-400 hover:text-slate-650'
                }`}
              title="Spacious Feed View"
            >
              <LayoutGrid className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('compact')}
              className={`p-2.5 rounded-xl transition-all cursor-pointer ${viewMode === 'compact'
                  ? 'bg-violet-50 text-violet-650'
                  : 'text-slate-400 hover:text-slate-650'
                }`}
              title="Compact List View"
            >
              <List className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Loading & Error States */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="h-10 w-10 animate-spin text-violet-600" />
            <span className="text-slate-500 text-sm font-medium">Loading poems...</span>
          </div>
        )}

        {isError && (
          <div className="flex items-center gap-3 rounded-2xl bg-red-50 border border-red-200 p-6 text-red-600 max-w-xl mx-auto my-10">
            <AlertCircle className="h-6 w-6 shrink-0" />
            <div>
              <h4 className="font-semibold">Failed to load poems</h4>
              <p className="text-sm text-red-600/80 mt-1">{error?.message || 'Please check your connection.'}</p>
            </div>
          </div>
        )}

        {/* Poems Feed */}
        {!isLoading && !isError && (
          <div className="space-y-6">
            {filteredGabays.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-slate-200 bg-white rounded-2xl">
                <PenTool className="mx-auto h-10 w-10 text-slate-400 mb-3" />
                <h3 className="font-semibold text-slate-700">No poems found</h3>
                <p className="text-sm text-slate-500 mt-1">Be the first to publish or refine your search query.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-6 max-w-7xl mx-auto">

                {/* Conditional View Rendering */}
                {viewMode === 'feed' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {paginatedGabays.map((gabay) => {
                      const likesCount = gabay.likes?.length || 0;
                      const commentsCount = gabay.comments?.length || 0;

                      return (
                        <Link
                          key={gabay._id}
                          to="/gabays/$id"
                          params={{ id: gabay._id }}
                          className="block rounded-2xl border border-slate-100 bg-white p-6 md:p-8 hover:border-violet-500/20 hover:shadow-xl hover:shadow-slate-200/40 hover:-translate-y-0.5 transition-all duration-300 shadow-sm group cursor-pointer"
                        >
                          <div className="flex flex-col gap-4">
                            {/* Header metadata row */}
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-violet-50 text-violet-750 flex items-center justify-center font-bold text-xs border border-violet-100">
                                {gabay.author?.username?.charAt(0).toUpperCase() || 'P'}
                              </div>
                              <div>
                                <span className="text-slate-800 font-bold text-sm block group-hover:text-violet-650 transition-colors">
                                  {gabay.author?.username || 'Unknown Author'}
                                </span>
                                <span className="text-[10px] text-slate-400 font-medium block">
                                  {new Date(gabay.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                              </div>
                            </div>

                            {/* Poem Title */}
                            <h2 className="font-display text-2xl font-bold text-slate-900 tracking-tight leading-snug group-hover:text-violet-650 transition-colors">
                              {gabay.title}
                            </h2>

                            {/* Poem Content (Truncated Preview) */}
                            <p className="text-slate-650 leading-relaxed font-serif border-l-2 border-slate-200/80 pl-4 text-sm md:text-base line-clamp-3 whitespace-pre-line">
                              {gabay.content}
                            </p>

                            {/* Footer Stats */}
                            <div className="flex items-center justify-between border-t border-slate-50 pt-4 text-xs font-semibold text-slate-400">
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1">
                                  <Heart className="h-4 w-4 text-slate-300 group-hover:text-rose-500 transition-colors" />
                                  <span>{likesCount} likes</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <MessageSquare className="h-4 w-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
                                  <span>{commentsCount} comments</span>
                                </div>
                              </div>
                              <span className="text-violet-655 font-bold transition-all text-xs inline-flex items-center gap-0.5 group-hover:translate-x-1">
                                Read full poem &rarr;
                              </span>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 w-full max-w-7xl mx-auto">
                    {/* Table Header Row (Desktop Only) */}
                    <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">
                      <div className="col-span-5">Poem Title</div>
                      <div className="col-span-3">Abwaan (Poet)</div>
                      <div className="col-span-2">Date</div>
                      <div className="col-span-2 text-right">Engagement</div>
                    </div>

                    {/* Table Rows */}
                    {paginatedGabays.map((gabay) => {
                      const likesCount = gabay.likes?.length || 0;
                      const commentsCount = gabay.comments?.length || 0;

                      return (
                        <Link
                          key={gabay._id}
                          to="/gabays/$id"
                          params={{ id: gabay._id }}
                          className="grid grid-cols-12 items-center gap-4 p-4 md:px-6 md:py-3.5 rounded-xl border border-slate-100 bg-white hover:border-violet-500/20 hover:shadow-md transition-all duration-200 group cursor-pointer w-full"
                        >
                          {/* Title (Mobile includes Poet/Date) */}
                          <div className="col-span-12 md:col-span-5 flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-violet-50 text-violet-750 flex items-center justify-center font-bold text-xs shrink-0 border border-violet-100">
                              {gabay.author?.username?.charAt(0).toUpperCase() || 'P'}
                            </div>
                            <div>
                              <h3 className="font-bold text-slate-900 group-hover:text-violet-650 transition-colors text-sm md:text-base leading-tight">
                                {gabay.title}
                              </h3>
                              <span className="md:hidden text-[10px] text-slate-400 font-medium block mt-0.5">
                                by {gabay.author?.username || 'Unknown'} • {new Date(gabay.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>

                          {/* Poet Column (Desktop Only) */}
                          <div className="hidden md:block col-span-3 text-sm font-semibold text-slate-600">
                            {gabay.author?.username || 'Unknown Author'}
                          </div>

                          {/* Date Column (Desktop Only) */}
                          <div className="hidden md:block col-span-2 text-xs text-slate-400 font-medium">
                            {new Date(gabay.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>

                          {/* Stats Column (Right-aligned on Desktop) */}
                          <div className="col-span-12 md:col-span-2 flex items-center justify-start md:justify-end gap-4 text-xs font-semibold text-slate-400 shrink-0">
                            <div className="flex items-center gap-1.5 hover:text-rose-500 transition-colors">
                              <Heart className="h-4 w-4 text-slate-300 fill-none" />
                              <span>{likesCount}</span>
                            </div>
                            <div className="flex items-center gap-1.5 hover:text-blue-500 transition-colors">
                              <MessageSquare className="h-4 w-4 text-slate-300 fill-none" />
                              <span>{commentsCount}</span>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8 pt-4">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-650 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer"
                    >
                      Previous
                    </button>
                    <span className="text-xs font-semibold text-slate-500 px-3">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-650 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Poem Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-650 p-1 rounded transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="font-display text-2xl font-bold text-slate-900 mb-6">
              Publish a New Poem (Maanso)
            </h3>

            <form onSubmit={handleCreatePoem} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Poem Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dardaaran"
                  value={newPoem.title}
                  onChange={(e) => setNewPoem({ ...newPoem, title: e.target.value })}
                  className="block w-full rounded-xl border border-slate-200 bg-slate-55 py-3 px-4 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Verses / Content
                </label>
                <textarea
                  required
                  rows={8}
                  placeholder="Write your verses here..."
                  value={newPoem.content}
                  onChange={(e) => setNewPoem({ ...newPoem, content: e.target.value })}
                  className="block w-full rounded-xl border border-slate-200 bg-slate-55 py-3 px-4 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20 transition-all resize-none font-serif leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl border border-slate-200 bg-transparent px-4 py-2.5 text-sm font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {createMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Publishing...</span>
                    </>
                  ) : (
                    <span>Publish Poem</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
