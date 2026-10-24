const day = (offset, hour = 10) => {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  date.setHours(hour, 0, 0, 0);
  return date.toISOString();
};

const student = (id, name, branch, year, interests, color, bio) => ({
  id, name, email: `${name.toLowerCase().replace(/\s+/g, '.')}@demo.jietcommunity.local`, savedActivityIds: [],
  branch, year, interests, avatar: '', avatarColor: color, bio, createdAt: day(-120),
  visibility: { email: false, year: true, interests: true },
});

export const seedStudents = [
  student('s1', 'Aarav Sharma', 'Computer Science and Engineering', '3rd Year', ['Football', 'Web Development', 'Hackathons'], '#635BDB', 'Building small things that make campus life a little easier.'),
  student('s2', 'Meera Rathore', 'Computer Science and Engineering - AI and ML', '2nd Year', ['Artificial Intelligence', 'Photography', 'Research'], '#E9A1B2', 'Curious about machine learning, visual stories and new ideas.'),
  student('s3', 'Kabir Singh', 'Mechanical Engineering', '4th Year', ['Cricket', 'Fitness', 'Robotics'], '#79A99B', 'Usually outdoors, sometimes taking apart a robot.'),
  student('s4', 'Ananya Jain', 'Information Technology', '2nd Year', ['Design', 'Web Development', 'Music'], '#E6B86A', 'Design-minded developer who loves making useful things.'),
  student('s5', 'Rohan Purohit', 'Electrical Engineering', '3rd Year', ['Badminton', 'Coding', 'Gaming'], '#648BC9', 'Learning by building with a good team.'),
  student('s6', 'Diya Suthar', 'Civil Engineering', '1st Year', ['Volunteering', 'Photography', 'Cultural Activities'], '#8C77BB', 'New around here and always up for meeting kind people.'),
  student('s7', 'Ishaan Mehta', 'Electronics and Communication Engineering', '4th Year', ['Entrepreneurship', 'Hackathons', 'Fitness'], '#E18558', 'Interested in products, prototypes and early morning runs.'),
  student('s8', 'Sara Khan', 'Computer Science and Engineering', '1st Year', ['Basketball', 'Music', 'Coding'], '#5D9DA8', 'First-year explorer: learning, playing and finding my people.'),
];

const activity = (id, title, category, description, organizerId, offset, time, location, max, participants, skillLevel, tags, extra = {}) => ({
  id, title, category, description, organizerId, date: day(offset, Number(time.split(':')[0])), startTime: time,
  endTime: extra.endTime || '', location, maxParticipants: max,
  minParticipants: extra.minParticipants || 2, participantIds: participants, skillLevel,
  eligibleBranches: extra.eligibleBranches || ['All'], eligibleYears: extra.eligibleYears || ['All'],
  tags, coverImage: '', meetingInstructions: extra.meetingInstructions || 'Meet near the main gathering point a few minutes before we start.',
  status: extra.status || (participants.length >= max ? 'full' : 'open'),
  createdAt: day(-Math.max(1, Math.abs(offset) + 4), 16), updatedAt: day(-1, 12),
});

export const seedActivities = [
  activity('a1', 'Sunday Football at the Campus Ground', 'Sports and Games', 'Looking for players for a friendly football match. Beginners and experienced players are both welcome.', 's3', 2, '17:00', 'Campus Ground', 14, ['s3', 's1', 's8', 's7', 's5'], 'All skill levels', ['Football', 'Outdoor', 'Teamwork'], { endTime: '18:30' }),
  activity('a2', 'Build a Campus Lost-and-Found App', 'Projects and Technology', 'Looking for motivated teammates interested in building a useful web application for campus. Bring ideas; we will shape the first version together.', 's1', 6, '16:00', 'Innovation Lab', 5, ['s1', 's4', 's2'], 'All skill levels', ['React', 'Web Development', 'Team Project'], { endTime: '17:30', meetingInstructions: 'Meet by the Innovation Lab entrance; bring a laptop if you have one.' }),
  activity('a3', 'DSA Beginner Study Circle', 'Academics and Study Groups', 'Weekly problem-solving sessions for students who want to strengthen their programming fundamentals, one concept at a time.', 's4', 3, '15:30', 'Library, Level 2', 8, ['s4', 's1', 's8', 's5'], 'Beginner friendly', ['DSA', 'Programming', 'Learning'], { endTime: '16:30' }),
  activity('a4', 'Hackathon Team Formation', 'Hackathons and Competitions', 'Meet students interested in brainstorming, designing, and building a prototype for upcoming hackathons.', 's7', 9, '17:30', 'Student Activity Centre', 6, ['s7', 's1', 's2', 's4'], 'All skill levels', ['Hackathon', 'Innovation', 'Collaboration'], { endTime: '19:00' }),
  activity('a5', 'Weekend Badminton Doubles', 'Sports and Games', 'Find partners for a relaxed doubles session and meet more people who enjoy badminton.', 's5', 1, '08:00', 'Indoor Sports Hall', 4, ['s5', 's3', 's8', 's6'], 'Beginner friendly', ['Badminton', 'Fitness'], { endTime: '09:00' }),
  activity('a6', 'AI and Machine Learning Discussion Group', 'Projects and Technology', 'Explore AI concepts, share learning resources, and brainstorm small machine learning projects in a beginner-friendly circle.', 's2', 4, '16:30', 'Learning Commons', 10, ['s2', 's1', 's4'], 'Beginner friendly', ['AI', 'Machine Learning', 'Study Group'], { endTime: '17:30' }),
  activity('a7', 'Inter-Branch Cricket Match', 'Sports and Games', 'Organize a friendly cricket match and bring together players from different branches. All experience levels welcome.', 's3', 7, '16:00', 'Practice Field', 22, ['s3', 's1', 's5', 's7', 's8', 's6'], 'All skill levels', ['Cricket', 'Teamwork'], { endTime: '18:00' }),
  activity('a8', 'UI/UX Design Jam', 'Creative Arts', 'Collaborate on redesigning an everyday student experience. Designers and developers are welcome; bring one idea to explore.', 's4', 11, '14:00', 'Design Studio', 6, ['s4', 's2', 's1'], 'All skill levels', ['UI/UX', 'Figma', 'Design'], { endTime: '16:00' }),
  activity('a9', 'Morning Running Group', 'Fitness and Wellness', 'Join a friendly morning running group. Choose your own pace and build consistency together.', 's7', 2, '06:30', 'Main Gate Plaza', 12, ['s7', 's3', 's6', 's8'], 'All skill levels', ['Running', 'Fitness', 'Wellness'], { endTime: '07:15' }),
  activity('a10', 'Open-Source Contribution Circle', 'Projects and Technology', 'Find people who want to learn Git, explore repositories, and make their first open-source contributions together.', 's1', 5, '16:00', 'Computer Lab 3', 8, ['s1', 's2', 's5', 's8'], 'Beginner friendly', ['Open Source', 'Git', 'Coding'], { endTime: '17:30' }),
  activity('a11', 'Campus Photography Walk', 'Creative Arts', 'Bring your phone or camera and explore creative photography with other students. No special gear or experience needed.', 's6', 8, '17:00', 'Library Steps', 8, ['s6', 's2', 's4'], 'All skill levels', ['Photography', 'Creativity'], { endTime: '18:00' }),
  activity('a12', 'Engineering Mathematics Revision', 'Academics and Study Groups', 'A peer-led revision group for discussing difficult concepts and solving practice problems together.', 's8', -5, '15:00', 'Academic Block B', 10, ['s8', 's1', 's5', 's4'], 'All skill levels', ['Mathematics', 'Study Group'], { status: 'completed', endTime: '16:30' }),
];

export const seedPosts = [
  { id: 'p1', authorId: 's4', text: 'Our first design jam turned a tiny campus annoyance into three promising ideas. Thanks to everyone who brought curiosity and sketches.', image: '', relatedActivityId: 'a8', tags: ['Design', 'Community'], likedBy: ['s1', 's2', 's6'], comments: [{ id: 'c1', authorId: 's2', text: 'Loved the quick sketch round!', createdAt: day(-1, 11) }], createdAt: day(-1, 10), updatedAt: day(-1, 10) },
  { id: 'p2', authorId: 's1', text: 'Putting together a small team for a campus lost-and-found idea. Looking for people who enjoy building practical things together.', image: '', relatedActivityId: 'a2', tags: ['Web Development', 'Team Project'], likedBy: ['s4', 's5'], comments: [], createdAt: day(-2, 13), updatedAt: day(-2, 13) },
  { id: 'p3', authorId: 's3', text: 'Friendly game, good teamwork, and a few dramatic saves. We are gathering players for another round this week.', image: '', relatedActivityId: 'a1', tags: ['Football', 'Sports'], likedBy: ['s8', 's7', 's1'], comments: [], createdAt: day(-3, 18), updatedAt: day(-3, 18) },
  { id: 'p4', authorId: 's2', text: 'A useful reminder from our study circle: start with the question you can explain, then work outward together.', image: '', relatedActivityId: 'a6', tags: ['AI', 'Learning'], likedBy: ['s1', 's4'], comments: [], createdAt: day(-4, 12), updatedAt: day(-4, 12) },
  { id: 'p5', authorId: 's6', text: 'I found a new favorite corner of campus on our photo walk. Next time, bring whatever camera you already have.', image: '', relatedActivityId: 'a11', tags: ['Photography', 'Campus'], likedBy: ['s2'], comments: [], createdAt: day(-5, 16), updatedAt: day(-5, 16) },
  { id: 'p6', authorId: 's7', text: 'Small steps count. A few of us are keeping a gentle morning running routine and there is always room for another pace.', image: '', relatedActivityId: 'a9', tags: ['Wellness', 'Running'], likedBy: ['s3', 's6'], comments: [], createdAt: day(-6, 8), updatedAt: day(-6, 8) },
];
