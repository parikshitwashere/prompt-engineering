import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, ArrowRight, CalendarDays, CheckCircle2, ClipboardList, Plus, Sparkles, Users, FileText, PartyPopper } from 'lucide-react';
import { useCommunity } from '../context/CommunityContext.jsx';
import { Avatar, Button, EmptyState, PageHeader, SectionHeading } from '../components/ui.jsx';
import ActivityCard from '../components/ActivityCard.jsx';
import CommunityPostCard from '../components/CommunityPostCard.jsx';
import StatCard from '../components/StatCard.jsx';
import { formatDate, getDashboardMetrics, getStudent, isUpcoming } from '../utils/helpers.js';
import toast from 'react-hot-toast';

const tabs = [{id:'overview',label:'Overview'},{id:'upcoming',label:'Upcoming'},{id:'organized',label:'Organized by me'},{id:'joined',label:'My participation'},{id:'past',label:'Past activities'},{id:'posts',label:'My posts'}];

export default function Dashboard() {
  const { state, toggleLike, addComment, updatePost, deletePost } = useCommunity();
  const [tab,setTab] = useState('overview');
  const student = getStudent(state.students,state.currentUserId) || state.students[0];
  const metrics = getDashboardMetrics(state,student.id);
  const mine = useMemo(()=>state.activities.filter((activity)=>activity.organizerId===student.id),[state.activities,student.id]);
  const joined = useMemo(()=>state.activities.filter((activity)=>activity.participantIds.includes(student.id)&&activity.organizerId!==student.id),[state.activities,student.id]);
  const past = useMemo(()=>[...new Map([...mine,...joined].filter((item)=>item.status==='completed'||new Date(item.date)<new Date()||item.status==='cancelled').map((item)=>[item.id,item])).values()], [mine,joined]);
  const upcoming = useMemo(()=>[...new Map([...mine,...joined,...state.activities.filter((item)=>(student.savedActivityIds||[]).includes(item.id))].filter(isUpcoming).map((item)=>[item.id,item])).values()].sort((a,b)=>new Date(a.date)-new Date(b.date)),[mine,joined,state.activities,student.savedActivityIds]);
  const posts = state.posts.filter((post)=>post.authorId===student.id);
  const renderCards = (list) => list.length ? <div className="card-grid">{list.map((item)=><ActivityCard key={item.id} activity={item} students={state.students}/>)}</div> : <EmptyState icon={CalendarDays} title="Nothing on this page yet" action={<Link to="/explore"><Button variant="secondary">Explore activities</Button></Link>}>Your activity history will appear here as you join or organize things with the community.</EmptyState>;
  const renderPosts = (list) => list.length ? <div className="post-stack">{list.map((post)=><CommunityPostCard key={post.id} post={post} students={state.students} activities={state.activities} currentUserId={student.id} onLike={toggleLike} onComment={(id,text)=>addComment(id,student.id,text)} onEdit={updatePost} onDelete={(id)=>{deletePost(id,student.id);toast.success('Post deleted.');}}/>)}</div> : <EmptyState icon={FileText} title="Your voice belongs here" action={<Link to="/publish"><Button icon={Plus}>Share an update</Button></Link>}>Share a project milestone, small win or invitation when you're ready.</EmptyState>;
  return <div className="dashboard-page"><PageHeader eyebrow="YOUR COMMUNITY STORY" title="My dashboard" description="A little record of the people, plans and projects you’ve been part of." action={<Link to="/profile"><Button variant="secondary" icon={AvatarIcon}>Edit profile</Button></Link>}/>
    <section className="dashboard-profile surface"><div className="dashboard-profile-left"><Avatar student={student} size="xl"/><div><h2>{student.name}</h2><span className="profile-subline">{student.branch} <i/> {student.year}</span><p>{student.bio || 'A JIET student finding people to learn and build with.'}</p><Link to="/profile" className="text-link">View my profile <ArrowRight size={14}/></Link></div></div><div className="dashboard-demo-note"><span className="demo-note-mark"><Sparkles size={15}/></span><div><strong>Your story, saved locally</strong><small>Demo history stays in this browser.</small></div></div></section>
    <section className="metrics-grid"><StatCard label="Activities organized" value={metrics.organized} detail="You brought people together" icon={ClipboardList} tone="violet"/><StatCard label="Activities joined" value={metrics.joined} detail="Registrations, not attendance" icon={Users} tone="mint"/><StatCard label="Activities completed" value={metrics.completed} detail="Kept in your history" icon={CheckCircle2} tone="amber"/><StatCard label="Community posts" value={metrics.posts} detail="Updates shared by you" icon={FileText} tone="blue"/></section>
    <div className="dashboard-tabs" role="tablist" aria-label="Dashboard sections">{tabs.map((item)=><button type="button" role="tab" aria-selected={tab===item.id} className={tab===item.id?'active':''} key={item.id} onClick={()=>setTab(item.id)}>{item.label}</button>)}</div>
    {tab==='overview'&&<div className="dashboard-content"><section><SectionHeading title="Coming up" description="Your next registered, saved and organized activities." action={<button className="text-link button-link" onClick={()=>setTab('upcoming')}>All upcoming <ArrowRight size={14}/></button>}/>{renderCards(upcoming.slice(0,3))}</section><section className="section-space"><SectionHeading title="Things you organized" description="Your invitations, open and completed." action={<button className="text-link button-link" onClick={()=>setTab('organized')}>See all <ArrowRight size={14}/></button>}/>{renderCards(mine.slice(0,3))}</section><section className="section-space"><SectionHeading title="Recent contributions" description="Your notes to the community." action={<button className="text-link button-link" onClick={()=>setTab('posts')}>All posts <ArrowRight size={14}/></button>}/>{renderPosts(posts.slice(0,2))}</section><div className="dashboard-callout"><span><PartyPopper size={20}/></span><div><strong>Something on your mind?</strong><small>A study group, game or idea can start with one simple invitation.</small></div><Link to="/publish"><Button icon={Plus}>Create something</Button></Link></div></div>}
    {tab==='upcoming'&&<div className="dashboard-content"><SectionHeading title="Coming up" description="Upcoming activities you joined, saved or organized."/>{renderCards(upcoming)}</div>}
    {tab==='organized'&&<div className="dashboard-content"><SectionHeading title="Organized by me" description="Your activities, including open and completed invitations."/>{renderCards(mine)}</div>}
    {tab==='joined'&&<div className="dashboard-content"><SectionHeading title="My participation" description="Activities where you're registered. Registration is not verified attendance."/>{renderCards(joined)}</div>}
    {tab==='past'&&<div className="dashboard-content"><SectionHeading title="Past activities" description="Completed, past-dated and cancelled activities remain in your history."/>{renderCards(past)}</div>}
    {tab==='posts'&&<div className="dashboard-content"><SectionHeading title="My posts" description="Your community updates and conversations." action={<Link to="/publish"><Button icon={Plus}>Write a post</Button></Link>}/>{renderPosts(posts)}</div>}
  </div>;
}
function AvatarIcon(props){return <Users {...props}/>;}
