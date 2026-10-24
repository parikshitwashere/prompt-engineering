import { seedActivities, seedPosts, seedStudents } from '../data/mock.js';

const STORAGE_KEY = 'jiet-community-v1';
const RECOVERY_KEY = `${STORAGE_KEY}-recovery`;
const makeInitialState = () => ({
  version: 1,
  currentUserId: 's1',
  students: seedStudents,
  activities: seedActivities,
  posts: seedPosts,
  notifications: [],
});

function preserveForRecovery(raw) {
  if (typeof window === 'undefined' || raw == null) return;
  try {
    window.localStorage.setItem(RECOVERY_KEY, raw);
  } catch (error) {
    console.warn('Could not create a local recovery copy of the unrecognized JIET Community data.', error);
  }
}

export function loadCommunityState() {
  if (typeof window === 'undefined') return makeInitialState();
  let raw = null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = makeInitialState();
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw);
    if (parsed?.version === 1 && Array.isArray(parsed.students) && Array.isArray(parsed.activities) && Array.isArray(parsed.posts)) {
      return { ...makeInitialState(), ...parsed, notifications: Array.isArray(parsed.notifications) ? parsed.notifications : [] };
    }
    preserveForRecovery(raw);
    console.warn('Saved JIET Community demo data was not recognized. A recovery copy was kept before sample data was loaded.');
  } catch (error) {
    preserveForRecovery(raw);
    console.warn('Could not read JIET Community demo data. A recovery copy was kept when possible; sample content is available for this session.', error);
  }
  return makeInitialState();
}

export function saveCommunityState(state) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn('Could not save this demo change in localStorage.', error);
  }
}
