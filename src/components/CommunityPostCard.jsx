import { useState } from 'react';
import { Heart, MessageCircle, MoreHorizontal, Send, Pencil, Trash2, X, Check } from 'lucide-react';
import { Avatar, Badge, Button } from './ui.jsx';
import { formatDate, getStudent } from '../utils/helpers.js';

export default function CommunityPostCard({ post, students, activities, currentUserId, onLike, onComment, onEdit, onDelete }) {
  const author = getStudent(students, post.authorId);
  const related = activities.find((activity) => activity.id === post.relatedActivityId);
  const liked = post.likedBy.includes(currentUserId);
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [menu, setMenu] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(post.text);
  const [commentError, setCommentError] = useState('');
  const submitComment = (event) => {
    event.preventDefault();
    if (!commentText.trim()) { setCommentError('Write a comment first.'); return; }
    onComment(post.id, commentText); setCommentText(''); setCommentError(''); setShowComments(true);
  };
  return <article className="surface post-card">
    <div className="post-head"><Avatar student={author} size="md" /><div className="post-author"><strong>{author?.name || 'Student'}</strong><span>{author?.branch || 'JIET student'} · {formatDate(post.createdAt, { month: 'short', day: 'numeric' })}</span></div>
      {post.authorId === currentUserId && <div className="post-menu-wrap"><button className="icon-plain" type="button" aria-label="Post options" onClick={() => setMenu((value) => !value)}><MoreHorizontal size={19} /></button>{menu && <div className="post-menu"><button type="button" onClick={() => { setEditing(true); setMenu(false); }}><Pencil size={14} /> Edit post</button><button type="button" className="danger-menu" onClick={() => { onDelete(post.id); setMenu(false); }}><Trash2 size={14} /> Delete post</button></div>}</div>}
    </div>
    {editing ? <div className="post-edit"><textarea className="textarea" value={draft} onChange={(event) => setDraft(event.target.value)} aria-label="Edit post text"/><div className="inline-actions"><Button variant="secondary" icon={X} onClick={() => { setEditing(false); setDraft(post.text); }}>Cancel</Button><Button icon={Check} onClick={() => { if (draft.trim()) onEdit(post.id, { text: draft.trim() }, currentUserId); setEditing(false); }}>Save changes</Button></div></div> : <p className="post-text">{post.text}</p>}
    {post.image && <img className="post-image" src={post.image} alt="Image shared in this community post" />}
    {post.tags?.length > 0 && <div className="chip-row post-tags">{post.tags.map((tag) => <Badge key={tag} tone="muted">#{tag}</Badge>)}</div>}
    {related && <div className="related-activity"><span>Related activity</span><strong>{related.title}</strong><span>{formatDate(related.date)}</span></div>}
    <div className="post-actions"><button type="button" className={`post-action ${liked ? 'liked' : ''}`} onClick={() => onLike(post.id)} aria-pressed={liked}><Heart size={16} fill={liked ? 'currentColor' : 'none'} />{post.likedBy.length || ''}<span>Like</span></button><button type="button" className="post-action" onClick={() => setShowComments((value) => !value)} aria-expanded={showComments}><MessageCircle size={16} />{post.comments.length || ''}<span>Comment</span></button></div>
    {showComments && <div className="post-comments">{post.comments.map((comment) => { const commenter = getStudent(students, comment.authorId); return <div className="comment-row" key={comment.id}><Avatar student={commenter} size="xs" /><div><strong>{commenter?.name || 'Student'}</strong><p>{comment.text}</p></div></div>; })}<form className="comment-form" onSubmit={submitComment}><label className="sr-only" htmlFor={`comment-${post.id}`}>Write a comment</label><input id={`comment-${post.id}`} className="input" placeholder="Add a thoughtful comment…" value={commentText} onChange={(event) => { setCommentText(event.target.value); setCommentError(''); }} /><button className="comment-send" type="submit" aria-label="Post comment"><Send size={16} /></button></form>{commentError && <span className="field-error" role="alert">{commentError}</span>}</div>}
  </article>;
}
