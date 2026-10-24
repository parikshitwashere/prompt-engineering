import { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, Bookmark, BookmarkCheck, CalendarDays, Clock3, MapPin, Users, ShieldCheck, Flag, Pencil, XCircle, Info, Check, MessageSquareText } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCommunity } from '../context/CommunityContext.jsx';
import { Avatar, Badge, Button, CategoryBadge, Field, Modal, ParticipantGroup } from '../components/ui.jsx';
import { formatDate, formatTime, getJoinBlockReason, getStudent, spotsLeft } from '../utils/helpers.js';

function localDate(value) { const date = new Date(value); return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0,10); }

export default function ActivityDetail() {
  const { id } = useParams(); const navigate = useNavigate(); const location = useLocation();
  const { state, joinActivity, leaveActivity, toggleSaveActivity, updateActivity } = useCommunity();
  const activity = state.activities.find((item) => item.id === id);
  const source = location.state?.from;
  const backPath = typeof source === 'string' && source.startsWith('/') && !source.startsWith('//') ? source : '/explore';
  const student = getStudent(state.students, state.currentUserId) || state.students[0];
  const [editOpen, setEditOpen] = useState(false); const [cancelOpen, setCancelOpen] = useState(false); const [saving, setSaving] = useState(false);
  const organizer = activity && getStudent(state.students, activity.organizerId);
  const participants = useMemo(() => activity?.participantIds.map((participantId) => getStudent(state.students, participantId)).filter(Boolean) || [], [activity,state.students]);
  const joined = activity?.participantIds.includes(student.id); const isOrganizer = activity?.organizerId === student.id;
  const joinBlock = !joined && !isOrganizer ? getJoinBlockReason(activity, student.id, student) : '';
  const isSaved = (student.savedActivityIds || []).includes(activity?.id);
  const leaveLocked = Boolean(joined && ['completed', 'cancelled'].includes(activity?.status));
  const [form, setForm] = useState(() => activity ? { title: activity.title, description: activity.description, date: localDate(activity.date), startTime: activity.startTime, endTime: activity.endTime || '', location: activity.location, maxParticipants: String(activity.maxParticipants), skillLevel: activity.skillLevel, meetingInstructions: activity.meetingInstructions || '' } : {});
  if (!activity) return <div className="missing-activity"><Link to="/explore" className="back-link"><ArrowLeft size={15}/> Back to Explore</Link><div className="surface missing-card"><div className="empty-icon"><Info size={21}/></div><h1>This activity moved on.</h1><p>It may have been removed from this demo. Explore other campus ideas instead.</p><Button onClick={() => navigate('/explore')}>Explore activities</Button></div></div>;
  const stateTone = { open: 'mint', full: 'amber', completed: 'blue', cancelled: 'pink' };
  const spots = spotsLeft(activity);
  const handleJoin = () => {
    if (joined) { const ok = leaveActivity(activity.id, student.id); ok ? toast.success('You left the activity.') : toast.error(leaveLocked ? 'This activity is closed; participant history is preserved.' : 'Could not leave this activity.'); return; }
    const result = joinActivity(activity.id, student.id); result.ok ? toast.success(result.message) : toast.error(result.message);
  };
  const saveEdit = (event) => {
    event.preventDefault(); setSaving(true);
    try {
      const capacity = Number(form.maxParticipants);
      if (!form.title.trim() || !form.description.trim() || !form.date || !form.startTime || !form.location.trim()) throw new Error('Complete the required details first.');
      if (!Number.isInteger(capacity) || capacity < participants.length || capacity < 1) throw new Error('Capacity must be a positive number and include the current participants.');
      if (new Date(`${form.date}T${form.startTime}`) < new Date() && !['completed','cancelled'].includes(activity.status)) throw new Error('Choose a future date and time.');
      updateActivity(activity.id, { ...form, date: new Date(`${form.date}T12:00:00`).toISOString(), maxParticipants: capacity }, student.id);
      toast.success('Activity details updated.'); setEditOpen(false);
    } catch (error) { toast.error(error.message || 'Could not save changes.'); }
    finally { setSaving(false); }
  };
  const cancelActivity = () => { try { updateActivity(activity.id, { status: 'cancelled' }, student.id); toast.success('Activity cancelled. Participant history is preserved.'); setCancelOpen(false); } catch (error) { toast.error(error.message); } };
  const updateField = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const shareReport = () => toast('Report noted in this demo. It is not sent to a moderation team.', { icon: 'i' });
  return <div className="activity-detail-page">
    <Link className="back-link" to={backPath}><ArrowLeft size={15}/>{backPath.startsWith('/explore') ? 'Back to Explore' : 'Back'}</Link>
    <div className="detail-layout"><article className="detail-main">
      <div className="detail-cover"><span className="detail-cover-orbit"/><span className="detail-cover-caption">JIET COMMUNITY <i>·</i> MADE BY STUDENTS</span><span className="detail-cover-symbol">{activity.category.includes('Sports') ? '✳' : activity.category.includes('Academics') ? '◎' : '✦'}</span><div className="detail-cover-badges"><CategoryBadge category={activity.category}/><Badge tone={stateTone[activity.status] || 'muted'}>{activity.status}</Badge></div></div>
      <div className="detail-title-row"><div><span className="eyebrow">LET'S MAKE IT HAPPEN</span><h1 className="detail-title">{activity.title}</h1></div><button className="icon-plain report-button" type="button" aria-label="Report this activity" onClick={shareReport}><Flag size={16}/></button></div>
      <p className="detail-description">{activity.description}</p>
      <div className="detail-facts"><div><CalendarDays size={17}/><span><small>DATE</small><strong>{formatDate(activity.date, {weekday:'long',month:'long',day:'numeric'})}</strong></span></div><div><Clock3 size={17}/><span><small>TIME</small><strong>{formatTime(activity.startTime)}{activity.endTime ? ` – ${formatTime(activity.endTime)}` : ''}</strong></span></div><div><MapPin size={17}/><span><small>LOCATION</small><strong>{activity.location}</strong></span></div><div><Users size={17}/><span><small>SKILL LEVEL</small><strong>{activity.skillLevel || 'All skill levels'}</strong></span></div></div>
      <section className="detail-section"><h2>What we're doing</h2><p>{activity.description}</p>{activity.meetingInstructions && <div className="meeting-note"><Info size={16}/><div><strong>Meeting notes</strong><span>{activity.meetingInstructions}</span></div></div>}</section>
      <section className="detail-section"><div className="detail-section-heading"><div><h2>Who's in?</h2><p>{participants.length} of {activity.maxParticipants} participants</p></div><ParticipantGroup students={participants} limit={6} size="sm"/></div>{participants.length ? <div className="participant-list">{participants.map((person) => <div className="participant-row" key={person.id}><Avatar student={person} size="sm"/><span><strong>{person.name}</strong><small>{person.id === activity.organizerId ? 'Organizer' : [person.visibility?.year === false ? '' : person.year, person.branch.split(' ')[0]].filter(Boolean).join(' · ')}</small></span>{person.id === activity.organizerId && <Badge tone="violet">HOST</Badge>}</div>)}</div> : <div className="participant-empty">Be the first to join this circle.</div>}</section>
      <div className="detail-bottom-note"><ShieldCheck size={16}/><span>Demo activity · participation is not attendance verification.</span></div>
    </article>
    <aside className="participation-panel surface"><div className="panel-status"><span className={`status-indicator status-${activity.status}`}/><strong>{activity.status === 'open' ? 'Open to join' : activity.status === 'full' ? 'This activity is full' : activity.status === 'cancelled' ? 'Activity cancelled' : 'Completed'}</strong></div><div className="spots-summary"><div><strong>{activity.status === 'open' ? spots : participants.length}</strong><span>{activity.status === 'open' ? 'open spots' : 'participants'}</span></div><div className="capacity-line"><span style={{width:`${Math.min(100,participants.length/Math.max(1,activity.maxParticipants)*100)}%`}}/></div><div className="capacity-label"><span>{participants.length} participating</span><span>{activity.maxParticipants} max</span></div></div>
      {isOrganizer ? <div className="organizer-actions"><div className="organizer-info"><Avatar student={organizer} size="md"/><span><small>ORGANIZED BY YOU</small><strong>{organizer?.name}</strong></span></div><Button variant="secondary" icon={Pencil} onClick={() => setEditOpen(true)}>Manage activity</Button>{!['cancelled','completed'].includes(activity.status) && <Button variant="danger" icon={XCircle} onClick={() => setCancelOpen(true)}>Cancel activity</Button>}</div> : <div className="organizer-info"><Avatar student={organizer} size="md"/><span><small>ORGANIZED BY</small><strong>{organizer?.name || 'JIET student'}</strong><em>{organizer?.branch || 'Student organizer'}</em></span><ArrowUpRight size={16}/></div>}
      {!isOrganizer && <Button className="join-button" disabled={(!joined && Boolean(joinBlock)) || leaveLocked} variant={joined ? 'secondary' : 'primary'} icon={joined ? Check : Users} onClick={handleJoin}>{joined ? 'Leave Activity' : joinBlock === 'This activity is full.' ? 'Activity full' : activity.status !== 'open' ? activity.status : joinBlock ? 'Not eligible' : 'Join Activity'}</Button>}
      {!isOrganizer && <Button className="save-button" variant="secondary" icon={isSaved ? BookmarkCheck : Bookmark} onClick={() => { toggleSaveActivity(activity.id, student.id); toast.success(isSaved ? 'Removed from saved activities.' : 'Saved for later.'); }}>{isSaved ? 'Saved for later' : 'Save for later'}</Button>}
      <div className="participation-note"><Info size={15}/><span>{joined ? `You’re on the participant list. Your registration is not verified attendance.${leaveLocked ? ' This activity is closed; your history stays preserved.' : ''}` : isOrganizer ? 'You are the organizer; your controls are only visible in this demo profile.' : joinBlock ? `You can’t join: ${joinBlock}` : 'Join to add this activity to your dashboard and participant list.'}</span></div>
      <div className="panel-detail-list"><div><span>Eligible branches</span><strong>{activity.eligibleBranches?.includes('All') ? 'All JIET students' : activity.eligibleBranches?.join(', ')}</strong></div><div><span>Academic years</span><strong>{activity.eligibleYears?.includes('All') ? 'All years' : activity.eligibleYears?.join(', ')}</strong></div>{activity.minParticipants && <div><span>Minimum group size</span><strong>{activity.minParticipants}</strong></div>}<div><span>Posted</span><strong>{formatDate(activity.createdAt)}</strong></div></div>
      {activity.tags?.length > 0 && <div className="detail-tags"><small>INTERESTS</small><div className="chip-row">{activity.tags.map((tag) => <span className="tag-pill" key={tag}>{tag}</span>)}</div></div>}
      <Link className="dashboard-shortcut" to="/dashboard"><MessageSquareText size={15}/> See your activity history <ArrowUpRight size={13}/></Link>
    </aside></div>

    <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Manage activity" description="Only you can edit this activity. Changes appear across the demo app.">
      <form className="manage-form" onSubmit={saveEdit}><Field label="Activity title" id="edit-title" required><input className="input" id="edit-title" value={form.title || ''} onChange={(e)=>updateField('title',e.target.value)}/></Field><Field label="Description" id="edit-desc" required><textarea className="textarea" id="edit-desc" value={form.description || ''} onChange={(e)=>updateField('description',e.target.value)}/></Field><div className="form-grid"><Field label="Date" id="edit-date" required><input className="input" type="date" id="edit-date" value={form.date || ''} onChange={(e)=>updateField('date',e.target.value)}/></Field><Field label="Start time" id="edit-time" required><input className="input" type="time" id="edit-time" value={form.startTime || ''} onChange={(e)=>updateField('startTime',e.target.value)}/></Field><Field label="Location" id="edit-location" required><input className="input" id="edit-location" value={form.location || ''} onChange={(e)=>updateField('location',e.target.value)}/></Field><Field label="Maximum participants" id="edit-capacity" required><input className="input" type="number" min={participants.length} id="edit-capacity" value={form.maxParticipants || ''} onChange={(e)=>updateField('maxParticipants',e.target.value)}/></Field></div><Field label="Skill level" id="edit-skill"><select className="select" id="edit-skill" value={form.skillLevel || 'All skill levels'} onChange={(e)=>updateField('skillLevel',e.target.value)}><option>Beginner friendly</option><option>Intermediate</option><option>Advanced</option><option>All skill levels</option></select></Field><Field label="Meeting instructions" id="edit-meeting"><textarea className="textarea" id="edit-meeting" value={form.meetingInstructions || ''} onChange={(e)=>updateField('meetingInstructions',e.target.value)}/></Field><div className="modal-actions"><Button type="button" variant="secondary" onClick={()=>setEditOpen(false)}>Close</Button><Button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</Button></div></form>
    </Modal>
    <Modal open={cancelOpen} onClose={() => setCancelOpen(false)} title="Cancel this activity?" description="Participant history will remain visible; no real notifications are sent."><p className="cancel-warning">The activity will be marked cancelled and no additional students can join.</p><div className="modal-actions"><Button variant="secondary" onClick={()=>setCancelOpen(false)}>Keep activity</Button><Button variant="danger" onClick={cancelActivity}>Cancel activity</Button></div></Modal>
  </div>;
}
