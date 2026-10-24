import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { loadCommunityState, saveCommunityState } from '../services/storage.js';
import { canJoin, getJoinBlockReason, makeId } from '../utils/helpers.js';

const CommunityContext = createContext(null);

export function CommunityProvider({ children }) {
  const [state, setState] = useState(loadCommunityState);
  useEffect(() => { saveCommunityState(state); }, [state]);

  const addNotice = useCallback((message, kind = 'info') => {
    const notice = { id: makeId('n'), message, kind, createdAt: new Date().toISOString() };
    setState((current) => ({ ...current, notifications: [notice, ...(current.notifications || [])].slice(0, 30) }));
  }, []);
  const chooseDemo = useCallback(() => setState((current) => ({ ...current, currentUserId: current.students[0]?.id || null })), []);

  const createStudent = useCallback((values) => {
    const student = { ...values, id: makeId('s'), email: values.email.trim(), name: values.name.trim(), interests: values.interests || [], savedActivityIds: [], avatar: values.avatar || '', avatarColor: values.avatarColor || '#635BDB', createdAt: new Date().toISOString(), visibility: { email: false, year: true, interests: true } };
    setState((current) => ({ ...current, students: [...current.students, student], currentUserId: student.id }));
    return student;
  }, []);
  const updateProfile = useCallback((studentId, patch) => setState((current) => ({ ...current, students: current.students.map((student) => student.id === studentId ? { ...student, ...patch, updatedAt: new Date().toISOString() } : student) })), []);

  const createActivity = useCallback((values, organizerId) => {
    const capacity = Number(values.maxParticipants);
    if (!values.title?.trim() || !values.description?.trim() || !values.date || !values.startTime || !values.location?.trim()) throw new Error('Complete the required activity details first.');
    if (new Date(`${values.date}T${values.startTime}`) <= new Date()) throw new Error('Choose a future date and time.');
    if (!Number.isInteger(capacity) || capacity < 1) throw new Error('Maximum participants must be a positive whole number.');
    if (values.minParticipants && (!Number.isInteger(Number(values.minParticipants)) || Number(values.minParticipants) < 1)) throw new Error('Minimum group size must be a positive whole number.');
    const now = new Date().toISOString();
    const participantIds = values.organizerParticipates === false ? [] : [organizerId];
    if (participantIds.length > capacity) throw new Error('Capacity must include the organizer if they are participating.');
    const activity = {
      ...values, id: makeId('a'), title: values.title.trim(), description: values.description.trim(), organizerId,
      maxParticipants: capacity, minParticipants: values.minParticipants ? Number(values.minParticipants) : null,
      participantIds, eligibleBranches: values.eligibleBranches?.length ? values.eligibleBranches : ['All'],
      eligibleYears: values.eligibleYears?.length ? values.eligibleYears : ['All'],
      tags: Array.isArray(values.tags) ? values.tags : String(values.tags || '').split(',').map((tag) => tag.trim()).filter(Boolean),
      meetingInstructions: values.meetingInstructions || '', coverImage: values.coverImage || '',
      status: participantIds.length >= capacity ? 'full' : 'open', createdAt: now, updatedAt: now,
    };
    setState((current) => ({ ...current, activities: [activity, ...current.activities] }));
    return activity;
  }, []);

  const joinActivity = useCallback((activityId, studentId) => {
    const target = state.activities.find((item) => item.id === activityId);
    if (!target) return { ok: false, message: 'This activity is no longer available.' };
    const student = state.students.find((item) => item.id === studentId);
    const blockReason = getJoinBlockReason(target, studentId, student);
    if (blockReason) return { ok: false, message: blockReason };
    setState((current) => {
      const live = current.activities.find((item) => item.id === activityId);
      const liveStudent = current.students.find((item) => item.id === studentId);
      if (!live || !canJoin(live, studentId, liveStudent)) return current;
      return { ...current, activities: current.activities.map((item) => item.id !== activityId ? item : {
        ...item, participantIds: [...item.participantIds, studentId],
        status: item.participantIds.length + 1 >= item.maxParticipants ? 'full' : 'open', updatedAt: new Date().toISOString(),
      }) };
    });
    return { ok: true, message: 'You joined the activity.' };
  }, [state.activities, state.students]);

  const leaveActivity = useCallback((activityId, studentId) => {
    const target = state.activities.find((item) => item.id === activityId);
    if (!target || target.organizerId === studentId || !target.participantIds.includes(studentId) || ['completed', 'cancelled'].includes(target.status)) return false;
    setState((current) => ({ ...current, activities: current.activities.map((item) => item.id !== activityId ? item : {
      ...item, participantIds: item.participantIds.filter((id) => id !== studentId),
      status: item.status === 'full' ? 'open' : item.status, updatedAt: new Date().toISOString(),
    }) }));
    return true;
  }, [state.activities]);

  const toggleSaveActivity = useCallback((activityId, studentId) => {
    if (!state.activities.some((activity) => activity.id === activityId)) return false;
    setState((current) => ({ ...current, students: current.students.map((student) => {
      if (student.id !== studentId) return student;
      const saved = student.savedActivityIds || [];
      return { ...student, savedActivityIds: saved.includes(activityId) ? saved.filter((id) => id !== activityId) : [...saved, activityId] };
    }) }));
    return true;
  }, [state.activities]);

  const updateActivity = useCallback((activityId, patch, studentId) => {
    const target = state.activities.find((item) => item.id === activityId);
    if (!target || target.organizerId !== studentId) throw new Error('Only the organizer can manage this activity.');
    const capacity = Number(patch.maxParticipants ?? target.maxParticipants);
    if (!Number.isInteger(capacity) || capacity < 1 || capacity < target.participantIds.length) throw new Error('Capacity must be a positive whole number and cannot be below the current participant count.');
    const next = { ...target, ...patch, maxParticipants: capacity, updatedAt: new Date().toISOString() };
    if (!['completed', 'cancelled'].includes(next.status)) next.status = next.participantIds.length >= capacity ? 'full' : 'open';
    setState((current) => ({ ...current, activities: current.activities.map((item) => item.id === activityId && item.organizerId === studentId ? next : item) }));
    return next;
  }, [state.activities]);

  const createPost = useCallback((values, authorId) => {
    if (!values.text?.trim()) throw new Error('Write a little about your update first.');
    const now = new Date().toISOString();
    const post = { id: makeId('p'), authorId, text: values.text.trim(), image: values.image || '', relatedActivityId: values.relatedActivityId || '', tags: Array.isArray(values.tags) ? values.tags : String(values.tags || '').split(',').map((tag) => tag.trim()).filter(Boolean), likedBy: [], comments: [], createdAt: now, updatedAt: now };
    setState((current) => ({ ...current, posts: [post, ...current.posts] }));
    return post;
  }, []);
  const updatePost = useCallback((postId, patch, studentId) => setState((current) => ({ ...current, posts: current.posts.map((post) => post.id === postId && post.authorId === studentId ? { ...post, ...patch, updatedAt: new Date().toISOString() } : post) })), []);
  const deletePost = useCallback((postId, studentId) => setState((current) => ({ ...current, posts: current.posts.filter((post) => !(post.id === postId && post.authorId === studentId)) })), []);
  const toggleLike = useCallback((postId, studentId) => setState((current) => ({ ...current, posts: current.posts.map((post) => post.id !== postId ? post : { ...post, likedBy: post.likedBy.includes(studentId) ? post.likedBy.filter((id) => id !== studentId) : [...post.likedBy, studentId] }) })), []);
  const addComment = useCallback((postId, studentId, text) => {
    if (!text.trim()) return;
    const comment = { id: makeId('c'), authorId: studentId, text: text.trim(), createdAt: new Date().toISOString() };
    setState((current) => ({ ...current, posts: current.posts.map((post) => post.id === postId ? { ...post, comments: [...post.comments, comment] } : post) }));
  }, []);

  const value = useMemo(() => ({ state, setState, addNotice, chooseDemo, createStudent, updateProfile, createActivity, joinActivity, leaveActivity, toggleSaveActivity, updateActivity, createPost, updatePost, deletePost, toggleLike, addComment }), [state, addNotice, chooseDemo, createStudent, updateProfile, createActivity, joinActivity, leaveActivity, toggleSaveActivity, updateActivity, createPost, updatePost, deletePost, toggleLike, addComment]);
  return <CommunityContext.Provider value={value}>{children}</CommunityContext.Provider>;
}

export function useCommunity() {
  const context = useContext(CommunityContext);
  if (!context) throw new Error('useCommunity must be used within CommunityProvider');
  return context;
}
