import { Link, useLocation } from 'react-router-dom';
import { CalendarDays, Clock3, MapPin, Users, ArrowUpRight } from 'lucide-react';
import { Avatar, Badge, CategoryBadge, ParticipantGroup } from './ui.jsx';
import { formatDate, formatTime, getStudent, spotsLeft } from '../utils/helpers.js';

const statusTone = { open: 'mint', full: 'amber', completed: 'blue', cancelled: 'pink' };

export default function ActivityCard({ activity, students, compact = false, list = false }) {
  const location = useLocation();
  const organizer = getStudent(students, activity.organizerId);
  const participants = activity.participantIds.map((id) => getStudent(students, id)).filter(Boolean);
  const spots = spotsLeft(activity);
  const progress = Math.min(100, (participants.length / Math.max(1, activity.maxParticipants)) * 100);
  return <Link to={`/activities/${activity.id}`} state={{ from: `${location.pathname}${location.search}` }} className={`surface activity-card activity-card-link ${list ? 'activity-card-list' : ''}`} aria-label={`View activity: ${activity.title}`}>
    {!compact && <div className={`activity-cover cover-${activity.id.slice(-1)}`} aria-hidden="true"><span className="cover-orbit orbit-one"/><span className="cover-orbit orbit-two"/><span className="cover-glyph">{activity.category.includes('Sports') ? '✳' : activity.category.includes('Academics') ? '◎' : activity.category.includes('Creative') ? '✦' : '↗'}</span><span className="cover-tag">{activity.tags[0]}</span></div>}
    <div className="activity-card-body">
      <div className="activity-card-top"><CategoryBadge category={activity.category} /><Badge tone={statusTone[activity.status] || 'muted'}>{activity.status === 'open' ? `${spots} spots left` : activity.status}</Badge></div>
      <h3 className="activity-card-title">{activity.title}</h3>
      <p className="activity-card-desc">{activity.description}</p>
      <div className="card-meta-stack">
        <span className="activity-meta"><CalendarDays size={14} />{formatDate(activity.date)}</span>
        <span className="activity-meta"><Clock3 size={14} />{formatTime(activity.startTime)}{activity.endTime ? ` – ${formatTime(activity.endTime)}` : ''}</span>
        <span className="activity-meta"><MapPin size={14} />{activity.location}</span>
      </div>
      <div className="card-footer"><span className="organizer-inline"><Avatar student={organizer} size="xs" /> <span className="truncate">{organizer?.name || 'Student organizer'}</span></span><span className="activity-meta participant-count"><Users size={14} />{participants.length}/{activity.maxParticipants}<ArrowUpRight size={13} /></span></div>
      <div className="spot-progress" aria-label={`${Math.round(progress)} percent full`}><span style={{ width: `${progress}%` }} /></div>
      {!compact && <div className="card-bottom"><ParticipantGroup students={participants} limit={4} /><span className="skill-pill">{activity.skillLevel}</span></div>}
    </div>
  </Link>;
}
