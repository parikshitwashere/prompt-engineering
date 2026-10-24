export const makeId = (prefix = 'id') => `${prefix}_${globalThis.crypto?.randomUUID?.() || `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`}`;

export function formatDate(value, options = { weekday: 'short', month: 'short', day: 'numeric' }) {
  if (!value) return 'Date to be confirmed';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Date to be confirmed';
  return new Intl.DateTimeFormat('en-IN', options).format(date);
}

export function formatTime(time) {
  if (!time) return '';
  const [hour, minute] = time.split(':').map(Number);
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) return time;
  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  return new Intl.DateTimeFormat('en-IN', { hour: 'numeric', minute: '2-digit' }).format(date);
}

export const spotsLeft = (activity) => Math.max(0, activity.maxParticipants - activity.participantIds.length);
export const isActivityFull = (activity) => activity.status === 'full' || spotsLeft(activity) <= 0;
export const isUpcoming = (activity) => new Date(activity.date).getTime() >= Date.now() && !['cancelled', 'completed'].includes(activity.status);
export const getStudent = (students, id) => students.find((student) => student.id === id);
export const categoryTone = (category = '') => {
  if (category.includes('Sports') || category.includes('Fitness')) return 'mint';
  if (category.includes('Technology') || category.includes('Hackathons')) return 'blue';
  if (category.includes('Academics')) return 'amber';
  if (category.includes('Creative') || category.includes('Culture')) return 'pink';
  if (category.includes('Volunteer')) return 'green';
  return 'violet';
};

export function getDashboardMetrics(state, studentId) {
  const organized = state.activities.filter((activity) => activity.organizerId === studentId);
  const joined = state.activities.filter((activity) => activity.participantIds.includes(studentId));
  return {
    organized: organized.length,
    joined: joined.filter((activity) => activity.organizerId !== studentId).length,
    completed: [...new Set([...organized, ...joined].filter((activity) => activity.status === 'completed').map((activity) => activity.id))].length,
    posts: state.posts.filter((post) => post.authorId === studentId).length,
  };
}

export function getJoinBlockReason(activity, studentId, student) {
  if (!activity) return 'This activity is no longer available.';
  if (activity.organizerId === studentId) return 'You are organizing this activity.';
  if (activity.status === 'full' || spotsLeft(activity) <= 0) return 'This activity is full.';
  if (activity.status !== 'open') return 'This activity is closed.';
  if (activity.participantIds.includes(studentId)) return 'You are already on the participant list.';
  const branches = activity.eligibleBranches || [];
  if (student && branches.length > 0 && !branches.includes('All') && !branches.includes(student.branch)) {
    return 'This activity is limited to select branches.';
  }
  const years = activity.eligibleYears || [];
  if (student && years.length > 0 && !years.includes('All') && !years.includes(student.year)) {
    return 'This activity is limited to select academic years.';
  }
  return '';
}

export function canJoin(activity, studentId, student) {
  return getJoinBlockReason(activity, studentId, student) === '';
}
