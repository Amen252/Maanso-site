import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, Link, useNavigate } from '@tanstack/react-router';
import { useAuth } from '../context/AuthContext.jsx';
import { getGabayById, toggleLike, addComment, deleteComment } from '../api/gabay.js';
import { 
  Heart, 
  MessageSquare, 
  Trash2, 
  Send, 
  Loader2, 
  ArrowLeft
} from 'lucide-react';

export default function GabayDetail() {
  const { id } = useParams({ from: '/gabays/$id' });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, isAuthenticated, isAdmin } = useAuth();
  const [commentInput, setCommentInput] = useState('');

  // Fetch Gabay details
  const { data: gabay, isLoading, isError, error } = useQuery({
    queryKey: ['gabay', id],
    queryFn: () => getGabayById(id),
  });

  // Toggle like mutation
  const likeMutation = useMutation({
    mutationFn: toggleLike,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gabay', id] });
      queryClient.invalidateQueries({ queryKey: ['gabays'] });
    },
  });

  // Add comment mutation
  const commentMutation = useMutation({
    mutationFn: addComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gabay', id] });
      queryClient.invalidateQueries({ queryKey: ['gabays'] });
      setCommentInput('');
    },
  });

  // Delete comment mutation
  const deleteCommentMutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gabay', id] });
      queryClient.invalidateQueries({ queryKey: ['gabays'] });
    },
  });

  const handleToggleLike = () => {
    if (!isAuthenticated) return alert('Please log in to like poems.');
    likeMutation.mutate(id);
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    commentMutation.mutate({ id, content: commentInput });
  };

  const handleDeleteComment = (commentId) => {
    if (confirm('Are you sure you want to delete this comment?')) {
      deleteCommentMutation.mutate({ id, commentId });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-5rem)] bg-slate-50 gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-violet-650" />
        <span className="text-slate-400 text-xs font-semibold">Loading poem...</span>
      </div>
    );
  }

  if (isError || !gabay) {
    return (
      <div className="mx-auto max-w-xl text-center py-20">
        <h2 className="text-xl font-bold text-slate-800">Poem not found</h2>
        <p className="text-slate-500 text-xs mt-1.5">{error?.message || "The poem you are looking for doesn't exist."}</p>
        <Link to="/" className="inline-flex items-center gap-1.5 mt-5 rounded-xl bg-violet-600 px-4 py-2 text-xs font-semibold text-white hover:bg-violet-700 transition-colors shadow-sm">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Feed
        </Link>
      </div>
    );
  }

  const likesCount = gabay.likes?.length || 0;
  const commentsCount = gabay.comments?.length || 0;
  const isLikedByUser = isAuthenticated && gabay.likes?.includes(user?._id);

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        
        {/* Back Button */}
        <Link 
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Feed</span>
        </Link>

        {/* The Clean Card */}
        <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
          {/* Header */}
          <div className="p-6 md:p-8 border-b border-slate-50">
            <h1 className="font-display text-2xl md:text-3xl font-bold text-slate-900 tracking-tight leading-snug">
              {gabay.title}
            </h1>
            
            <div className="flex items-center gap-3 mt-4">
              <div className="h-9 w-9 rounded-full bg-violet-55 text-violet-700 flex items-center justify-center font-bold text-sm border border-violet-100">
                {gabay.author?.username?.charAt(0).toUpperCase() || 'P'}
              </div>
              <div>
                <span className="text-slate-800 font-bold text-sm block">{gabay.author?.username || 'Unknown Author'}</span>
                <span className="text-[11px] text-slate-400 font-medium block mt-0.5">
                  Published {new Date(gabay.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
            </div>
          </div>

          {/* Poem Content */}
          <div className="p-6 md:p-8 font-serif text-base md:text-lg text-slate-800 leading-loose whitespace-pre-line border-b border-slate-50 pl-8 md:pl-12 border-l-2 border-l-violet-600/40">
            {gabay.content}
          </div>

          {/* Stats Bar */}
          <div className="px-6 py-4 md:px-8 bg-slate-50/50 flex items-center justify-between border-b border-slate-50">
            <div className="flex items-center gap-5">
              <button
                onClick={handleToggleLike}
                className={`flex items-center gap-1.5 text-xs font-semibold transition-colors cursor-pointer group ${
                  isLikedByUser ? 'text-pink-600' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Heart className={`h-4 w-4 ${isLikedByUser ? 'fill-current' : 'group-hover:scale-110 transition-transform'}`} />
                <span>{likesCount} likes</span>
              </button>

              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                <MessageSquare className="h-4 w-4" />
                <span>{commentsCount} comments</span>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="p-6 md:p-8">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-4">Conversation</h3>

            {/* Comments List */}
            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2 mb-6">
              {gabay.comments?.length === 0 ? (
                <p className="text-slate-400 text-xs italic py-2">No comments yet. Be the first to share your analysis!</p>
              ) : (
                gabay.comments.map((comment) => {
                  const isCommentAuthor = isAuthenticated && comment.author?._id === user?._id;
                  const isPoemAuthor = isAuthenticated && gabay.author?._id === user?._id;
                  const canDelete = isCommentAuthor || isPoemAuthor || isAdmin;

                  return (
                    <div key={comment._id} className="flex items-start justify-between gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                      <div className="flex gap-2.5">
                        <div className="h-8 w-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                          {comment.author?.username?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold text-slate-800">{comment.author?.username}</span>
                            <span className="text-[9px] text-slate-400">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-xs text-slate-650 mt-1 leading-relaxed">{comment.content}</p>
                        </div>
                      </div>

                      {canDelete && (
                        <button
                          onClick={() => handleDeleteComment(comment._id)}
                          className="text-slate-400 hover:text-red-600 p-1 rounded transition-colors cursor-pointer shrink-0"
                          title="Delete Comment"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Add Comment Input */}
            {isAuthenticated ? (
              <form onSubmit={handleAddComment} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Share your feedback or analysis..."
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  className="flex-grow rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20 transition-all"
                />
                <button
                  type="submit"
                  disabled={commentMutation.isPending}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 text-white hover:bg-violet-750 transition-colors cursor-pointer shrink-0 disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            ) : (
              <p className="text-[11px] text-slate-400">
                Please <Link to="/login" className="font-bold text-violet-600 hover:underline">sign in</Link> to join the conversation.
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
