import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, CalendarDays, Gamepad2, Lightbulb, PartyPopper, Plus, Sparkles } from 'lucide-react';
import { useCommunity } from '../context/CommunityContext.jsx';
import { Avatar, Button, EmptyState, SectionHeading } from '../components/ui.jsx';
import ActivityCard from '../components/ActivityCard.jsx';
import CommunityPostCard from '../components/CommunityPostCard.jsx';
import { formatDate, getStudent, isUpcoming } from '../utils/helpers.js';
import toast from 'react-hot-toast';

const feedCategories = ['All Activities', 'Sports and Games', 'Projects and Technology', 'Academics and Study Groups', 'Hackathons and Competitions', 'Events and Culture', 'Fitness and Wellness', 'Creative Arts', 'Volunteering', 'Other'];

export default function Home() {
  const { state, toggleLike, addComment, updatePost, deletePost } = useCommunity();
  const student = getStudent(state.students, state.currentUserId) || state.students[0];
  const navigate = useNavigate();
  const [feedTab, setFeedTab] = useState('activities');
  const [feedSort, setFeedSort] = useState('newest');
  const [feedCategory, setFeedCategory] = useState('All Activities');
  const now = new Date();
  const greeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 17 ? 'Good afternoon' : 'Good evening';
  const savedIds = student.savedActivityIds || [];

  const featured = useMemo(
    () => state.activities.filter((item) => item.status === 'open' && isUpcoming(item)).slice(0, 3),
    [state.activities],
  );
  const recommended = useMemo(() => state.activities.filter((item) => {
    if (!isUpcoming(item) || item.organizerId === student.id || item.status !== 'open') return false;
    return item.tags.some((tag) => student.interests?.some((interest) =>
      tag.toLowerCase().includes(interest.toLowerCase()) || interest.toLowerCase().includes(tag.toLowerCase())))
      || student.interests?.some((interest) => item.category.toLowerCase().includes(interest.toLowerCase()));
  }).slice(0, 3), [state.activities, student]);
  const upcoming = state.activities
    .filter((item) => (item.participantIds.includes(student.id) || savedIds.includes(item.id)) && isUpcoming(item))
    .sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 4);
  const freshActivities = useMemo(() => [...state.activities]
    .filter((item) => feedCategory === 'All Activities' || item.category === feedCategory)
    .sort((a, b) => feedSort === 'soonest'
      ? new Date(a.date) - new Date(b.date)
      : new Date(b.createdAt) - new Date(a.createdAt)), [state.activities, feedSort, feedCategory]);
  const posts = useMemo(() => [...state.posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)), [state.posts]);
  const quick = [
    { title: 'Play something', caption: 'Find a game or team', icon: Gamepad2, to: '/explore', color: 'quick-lilac' },
    { title: 'Build something', caption: 'Meet project teammates', icon: Lightbulb, to: '/explore?category=Projects%20and%20Technology', color: 'quick-blue' },
    { title: 'Bring people together', caption: 'Start an activity', icon: Plus, to: '/publish', color: 'quick-coral' },
    { title: 'See your story', caption: 'Your campus activity', icon: CalendarDays, to: '/dashboard', color: 'quick-mint' },
  ];

  const deleteOwnPost = (id) => {
    deletePost(id, student.id);
    toast.success('Post deleted.');
  };

  return <div className="home-page">
    <section className="welcome-row">
      <div>
        <span className="eyebrow"><span className="live-dot" /> YOUR CAMPUS, IN MOTION · {formatDate(new Date(), { weekday: 'long', month: 'long', day: 'numeric' }).toUpperCase()}</span>
        <h1 className="welcome-title">{greeting}, {student.name.split(' ')[0]}<span className="wave-mark">✳</span></h1>
        <p>What are you building, learning or playing this week?</p>
      </div>
      <button className="welcome-avatar" onClick={() => navigate('/profile')} type="button" aria-label="Open your profile">
        <Avatar student={student} size="lg" /><span className="avatar-edit-dot"><ArrowUpRight size={12} /></span>
      </button>
    </section>

    <section className="quick-grid" aria-label="Quick actions">
      {quick.map(({ title, caption, icon: Icon, to, color }) => <Link to={to} key={title} className={`surface quick-card ${color}`}>
        <span className="quick-icon"><Icon size={19} /></span><span className="quick-copy"><strong>{title}</strong><small>{caption}</small></span><ArrowUpRight className="quick-arrow" size={15} />
      </Link>)}
    </section>

    {upcoming.length > 0 && <section className="upcoming-strip"><div className="upcoming-icon"><CalendarDays size={18} /></div><div className="upcoming-copy"><strong>Coming up for you</strong><span>{upcoming.map((item) => `${item.title}${!item.participantIds.includes(student.id) ? ' · Saved' : ''}`).join(' · ')}</span></div><Link to="/dashboard" aria-label="See upcoming activities"><ArrowRight size={17} /></Link></section>}

    <section className="section-space">
      <SectionHeading title="A good place to start" description="Ideas with room for one more." action={<Link className="text-link" to="/explore">See everything <ArrowRight size={14} /></Link>} />
      {featured.length ? <div className="card-grid">{featured.map((activity) => <ActivityCard key={activity.id} activity={activity} students={state.students} />)}</div> : <EmptyState icon={Sparkles} title="A fresh start is waiting" action={<Button onClick={() => navigate('/publish')}>Create the first activity</Button>}>No open activities match just yet. You can make something happen.</EmptyState>}
    </section>

    <section className="section-space community-spotlight">
      <SectionHeading eyebrow="COMMUNITY SPOTLIGHT · DEMO EXAMPLES" title="People making things happen." description="A few student organizers and the plans bringing people together." />
      <div className="spotlight-grid">{featured.slice(0, 3).map((activity) => { const organizer = getStudent(state.students, activity.organizerId); if (!organizer) return null; return <Link to={`/activities/${activity.id}`} state={{ from: '/home' }} className="surface spotlight-card" key={activity.id}><div className="spotlight-person"><Avatar student={organizer} size="md"/><span><strong>{organizer.name}</strong><small>{organizer.branch} · {organizer.year}</small></span><ArrowUpRight size={15}/></div><p>{organizer.bio || 'A JIET student bringing people together around an idea.'}</p><div className="spotlight-plan"><small>SPOTLIGHT PLAN</small><strong>{activity.title}</strong><span>{activity.category}</span></div></Link>; })}</div>
    </section>

    <section className="section-space home-for-you">
      <div className="for-you-banner"><div><span className="eyebrow"><Sparkles size={12} /> PICKED FOR YOU</span><h2>A little closer to your interests.</h2><p>Based on your interests: {student.interests?.slice(0, 3).join(', ') || 'discover something new'}.</p></div><Link to="/profile" className="for-you-edit">Tune your interests <ArrowUpRight size={14} /></Link></div>
      {recommended.length ? <div className="card-grid">{recommended.map((activity) => <ActivityCard key={activity.id} activity={activity} students={state.students} compact />)}</div> : <div className="recommend-empty"><span>Your next favorite may be outside your usual orbit.</span><Link to="/explore">Explore all activities <ArrowRight size={14} /></Link></div>}
    </section>

    <section className="section-space home-feed-section">
      <div className="feed-switch-row"><SectionHeading title={feedTab === 'activities' ? 'Fresh on campus' : 'Community notes'} description={feedTab === 'activities' ? 'New invitations from around JIET.' : 'Little updates, milestones and open invitations.'} action={feedTab === 'activities' ? <Link to="/explore" className="text-link">Explore <ArrowRight size={14} /></Link> : <Link to="/publish" className="text-link">Share yours <Plus size={14} /></Link>} />
        <div className="feed-switch" role="tablist" aria-label="Choose Home feed content"><button type="button" role="tab" aria-selected={feedTab === 'activities'} className={feedTab === 'activities' ? 'active' : ''} onClick={() => setFeedTab('activities')}>Activities</button><button type="button" role="tab" aria-selected={feedTab === 'posts'} className={feedTab === 'posts' ? 'active' : ''} onClick={() => setFeedTab('posts')}>Community posts</button></div>
      </div>
      {feedTab === 'activities' ? <>
        <div className="category-scroll home-feed-categories" role="group" aria-label="Filter Home activities by category">{feedCategories.map((category) => <button key={category} type="button" className={`chip ${feedCategory === category ? 'selected' : ''}`} aria-pressed={feedCategory === category} onClick={() => setFeedCategory(category)}>{category}</button>)}</div>
        <div className="feed-controls"><span>Showing the latest invitations</span><label>Sort <select aria-label="Sort fresh activities" value={feedSort} onChange={(event) => setFeedSort(event.target.value)}><option value="newest">Newest</option><option value="soonest">Soonest</option></select></label></div>
        {freshActivities.length ? <div className="fresh-list">{freshActivities.map((activity) => <Link key={activity.id} to={`/activities/${activity.id}`} state={{ from: '/home' }} className="fresh-row"><span className={`fresh-icon ${activity.category.includes('Sports') ? 'fresh-sport' : activity.category.includes('Technology') ? 'fresh-tech' : 'fresh-other'}`}>{activity.category.includes('Sports') ? '✳' : activity.category.includes('Academics') ? '◎' : '✦'}</span><span className="fresh-main"><strong>{activity.title}</strong><small>{activity.category} · {getStudent(state.students, activity.organizerId)?.name}</small></span><span className="fresh-date">{formatDate(activity.createdAt, { month: 'short', day: 'numeric' })}</span><ArrowUpRight size={14} className="fresh-arrow" /></Link>)}</div> : <EmptyState icon={CalendarDays} title="No activities in this category" action={<Button variant="secondary" onClick={() => setFeedCategory('All Activities')}>Show all activities</Button>}>Try another category or create a new activity for your community.</EmptyState>}
      </> : posts.length ? <div className="post-stack">{posts.map((post) => <CommunityPostCard key={post.id} post={post} students={state.students} activities={state.activities} currentUserId={student.id} onLike={toggleLike} onComment={(id, text) => addComment(id, student.id, text)} onEdit={updatePost} onDelete={deleteOwnPost} />)}</div> : <EmptyState icon={PartyPopper} title="Start the conversation">Share a small win, project note or open invitation.</EmptyState>}
    </section>

    <div className="home-bottom-cta"><div><span className="eyebrow">THE BEST PLANS START SMALL</span><h2>Have an idea? Invite people in.</h2><p>A few interested people can turn a thought into an afternoon worth remembering.</p></div><Button icon={Plus} onClick={() => navigate('/publish')}>Create an activity</Button></div>
  </div>;
}
