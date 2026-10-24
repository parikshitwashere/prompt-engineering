import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Check, ChevronLeft, ChevronRight, CircleUserRound, Compass, Sparkles, Users, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCommunity } from '../context/CommunityContext.jsx';
import { Avatar, Button, Logo } from '../components/ui.jsx';

const branches = ['Computer Science and Engineering', 'Computer Science and Engineering - AI and ML', 'Information Technology', 'Electronics and Communication Engineering', 'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering', 'Other'];
const years = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Other'];
const interests = ['Football', 'Cricket', 'Basketball', 'Badminton', 'Fitness', 'Coding', 'Web Development', 'Artificial Intelligence', 'Robotics', 'Hackathons', 'Research', 'Entrepreneurship', 'Design', 'Music', 'Photography', 'Gaming', 'Volunteering', 'Cultural Activities', 'Other'];

function HeroCollage() {
  return <div className="hero-collage" aria-label="A preview of activities and students in the JIET Community">
    <div className="collage-halo" />
    <div className="float-card float-card-main"><div className="float-card-top"><span className="tiny-icon sport-icon">✳</span><span className="mini-label">SPORTS & GAMES</span><span className="mini-join">+ Join</span></div><div className="mini-title">Sunday football<br/>at the ground</div><div className="mini-place">◷ Sunday · 5:00 PM &nbsp;·&nbsp; Campus Ground</div><div className="mini-people"><div className="mini-avatars"><i style={{background:'#e9a1b2'}}>M</i><i style={{background:'#7da99b'}}>K</i><i style={{background:'#e5b76d'}}>A</i><i style={{background:'#647fc1'}}>R</i></div><span>8 people going</span></div></div>
    <div className="float-card float-card-team"><div className="team-icon"><span>✧</span></div><div><span className="mini-label">PROJECT TEAM</span><strong>Campus lost & found</strong><span className="team-seats">2 spots left · React</span></div><div className="team-arrow"><ArrowUpRight size={16}/></div></div>
    <div className="float-card float-card-match"><span className="match-dot"/><div><span className="mini-label">GOOD MATCH</span><strong>Design + Web Dev</strong><small>3 shared interests</small></div><div className="match-stars">✦</div></div>
    <div className="float-card float-card-avatars"><div className="avatar-row"><i style={{background:'#635bdb'}}>A</i><i style={{background:'#e9a1b2'}}>M</i><i style={{background:'#79a99b'}}>K</i><i style={{background:'#e6b86a'}}>D</i></div><strong>Find your people</strong><small>All across JIET</small></div>
    <div className="collage-note"><span className="live-dot"/> student-led · always growing</div>
  </div>;
}

export default function Landing() {
  const navigate = useNavigate();
  const { chooseDemo, createStudent } = useCommunity();
  const [onboarding, setOnboarding] = useState(false);
  const [step, setStep] = useState(1);
  const [values, setValues] = useState({ name: '', email: '', branch: '', year: '', bio: '', interests: [], avatar: '' });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const onboardingRef = useRef(null);
  const returnFocusRef = useRef(null);
  const enterDemo = (route = '/home') => { chooseDemo(); navigate(route); };
  useEffect(() => {
    if (!onboarding) { returnFocusRef.current?.focus?.(); return; }
    const selector = step === 1 ? '#student-name' : '.interest-option';
    onboardingRef.current?.querySelector(selector)?.focus();
  }, [onboarding, step]);
  useEffect(() => {
    if (!onboarding) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') { setOnboarding(false); return; }
      if (event.key !== 'Tab') return;
      const dialog = onboardingRef.current;
      const focusable = [...(dialog?.querySelectorAll('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])') || [])].filter((item) => item.getClientRects().length > 0);
      if (!focusable.length) { event.preventDefault(); dialog?.focus(); return; }
      const first = focusable[0]; const last = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) { event.preventDefault(); first.focus(); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onboarding]);
  const set = (key, value) => { setValues((current) => ({ ...current, [key]: value })); setErrors((current) => ({ ...current, [key]: '' })); };
  const toggleInterest = (interest) => set('interests', values.interests.includes(interest) ? values.interests.filter((item) => item !== interest) : [...values.interests, interest]);
  const validate = () => {
    const next = {};
    if (step === 1) {
      if (!values.name.trim()) next.name = 'Add your name to continue.';
      if (!values.email.trim()) next.email = 'Enter your college email address.';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) next.email = 'Enter a valid email address.';
      if (!values.branch) next.branch = 'Choose your branch.';
      if (!values.year) next.year = 'Choose your current year.';
    } else {
      if (!values.interests.length) next.interests = 'Choose at least one interest.';
      if (values.bio.length > 180) next.bio = 'Keep your bio under 180 characters.';
    }
    setErrors(next); return Object.keys(next).length === 0;
  };
  const nextStep = (event) => { event.preventDefault(); if (validate()) setStep(2); };
  const submitProfile = (event) => {
    event.preventDefault();
    if (!validate()) return;
    setSaving(true);
    const student = createStudent({ ...values, avatarColor: ['#635BDB', '#E9A1B2', '#79A99B', '#E6B86A'][Math.floor(Math.random() * 4)] });
    toast.success('Your demo profile is ready. Email verification is not enabled.');
    setSaving(false); navigate('/home', { state: { newStudentId: student.id } });
  };
  const uploadAvatar = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/') || file.size > 2_000_000) { setErrors((current) => ({ ...current, avatar: 'Choose an image under 2 MB.' })); return; }
    const reader = new FileReader(); reader.onload = () => set('avatar', String(reader.result)); reader.readAsDataURL(file);
  };

  return <div className="landing-shell">
    <header className="landing-nav"><a className="brand-link" href="/" onClick={(event) => { event.preventDefault(); navigate('/'); }}><Logo size={38}/><span className="brand-name">JIET <b>Community</b></span></a><div className="landing-nav-right"><span className="nav-campus-note"><span className="live-dot"/> Made for JIET students</span><button className="landing-signin" type="button" onClick={() => enterDemo()}>Enter demo <ArrowUpRight size={14}/></button></div></header>
    <main>
      <section className="landing-hero">
        <div className="hero-copy">
          <div className="hero-eyebrow"><span className="eyebrow-mark"><Sparkles size={12}/></span> BUILT FOR THE JIET COMMUNITY</div>
          <h1>Your next great college experience <span>starts here.</span></h1>
          <p>Find teammates, discover opportunities, build projects, and turn shared interests into real experiences with students across JIET.</p>
          <div className="hero-actions"><Button icon={ArrowRight} onClick={(event) => { returnFocusRef.current = event.currentTarget; setOnboarding(true); setStep(1); }}>Join the Community</Button><Button variant="secondary" icon={Compass} onClick={() => enterDemo('/explore')}>Explore Activities</Button></div>
          <div className="hero-proof"><div className="hero-proof-avatars"><i style={{background:'#645fdb'}}>A</i><i style={{background:'#e7a3b4'}}>M</i><i style={{background:'#7da99b'}}>K</i><i style={{background:'#e3b76b'}}>D</i></div><div><strong>Make your next thing happen.</strong><span>Real interests. Shared experiences.</span></div><div className="proof-divider"/><div className="proof-count"><Users size={16}/><strong>One campus,<br/>many possibilities</strong></div></div>
        </div>
        <HeroCollage />
      </section>
      <section className="landing-bottom"><div><span className="eyebrow">A LITTLE MORE THAN A NOTICEBOARD</span><h2>From “who’s in?”<br/>to <span>“we did it.”</span></h2></div><div className="landing-values"><article><span className="value-number">01</span><strong>Find your people</strong><p>Meet students who are curious about the same things you are.</p></article><article><span className="value-number">02</span><strong>Make a plan</strong><p>Start a game, study circle, side project or something new.</p></article><article><span className="value-number">03</span><strong>Keep the story</strong><p>See what you joined, organized and built along the way.</p></article></div></section>
    </main>
    <footer className="landing-footer"><span>JC · JIET Community</span><span>Your people. Your passions. Your campus.</span><button type="button" onClick={() => enterDemo('/home')}>Try the demo <ArrowRight size={13}/></button></footer>

    {onboarding && <div className="onboarding-overlay"><section ref={onboardingRef} className="onboarding-panel" role="dialog" aria-modal="true" aria-labelledby="onboard-title" tabIndex={-1}><div className="onboard-head"><div className="brand-link"><Logo/><span className="brand-name">JIET <b>Community</b></span></div><button className="icon-plain" type="button" onClick={() => setOnboarding(false)} aria-label="Close onboarding"><X size={18}/></button></div><div className="progress-line"><span style={{width:step === 1 ? '48%' : '100%'}}/></div><div className="onboard-intro"><span className="eyebrow">STEP {step} OF 2 · DEMO PROFILE</span><h2 id="onboard-title">{step === 1 ? 'A little about you.' : 'What are you into?'}</h2><p>{step === 1 ? 'Help your campus community put a name to the face.' : 'Pick the things you would love to do with other students.'}</p></div>
      {step === 1 ? <form className="onboard-form" onSubmit={nextStep} noValidate>
        <div className="form-grid"><div><label className="field-label" htmlFor="student-name">Full name *</label><input id="student-name" className="input" autoComplete="name" placeholder="e.g. Aarav Sharma" value={values.name} onChange={(event) => set('name', event.target.value)}/>{errors.name && <span className="field-error">{errors.name}</span>}</div><div><label className="field-label" htmlFor="student-email">College email *</label><input id="student-email" className="input" type="email" autoComplete="email" placeholder="you@college.edu" value={values.email} onChange={(event) => set('email', event.target.value)}/>{errors.email && <span className="field-error">{errors.email}</span>}</div>
          <div><label className="field-label" htmlFor="student-branch">Branch / department *</label><select id="student-branch" className="select" value={values.branch} onChange={(event) => set('branch', event.target.value)}><option value="">Choose your branch</option>{branches.map((branch) => <option key={branch}>{branch}</option>)}</select>{errors.branch && <span className="field-error">{errors.branch}</span>}</div><div><label className="field-label" htmlFor="student-year">Academic year *</label><select id="student-year" className="select" value={values.year} onChange={(event) => set('year', event.target.value)}><option value="">Choose your year</option>{years.map((year) => <option key={year}>{year}</option>)}</select>{errors.year && <span className="field-error">{errors.year}</span>}</div>
        </div><div className="demo-explain"><CircleUserRound size={16}/><span>Demo only: your email is not verified, and your profile is stored in this browser.</span></div><Button className="onboard-submit" type="submit" icon={ArrowRight}>Continue</Button>
      </form> : <form className="onboard-form" onSubmit={submitProfile} noValidate>
        <div className="interest-grid">{interests.map((interest) => <button key={interest} type="button" className={`interest-option ${values.interests.includes(interest) ? 'selected' : ''}`} aria-pressed={values.interests.includes(interest)} onClick={() => toggleInterest(interest)}>{values.interests.includes(interest) && <Check size={13}/>} {interest}</button>)}</div>{errors.interests && <span className="field-error" role="alert">{errors.interests}</span>}
        <label className="field-label bio-label" htmlFor="student-bio">A short bio <span>optional · up to 180 characters</span></label><textarea id="student-bio" className="textarea bio-textarea" maxLength={180} placeholder="Tell people what you enjoy doing…" value={values.bio} onChange={(event) => set('bio', event.target.value)}/>{errors.bio && <span className="field-error">{errors.bio}</span>}
        <div className="avatar-upload-row"><label className="avatar-upload-control"><input type="file" accept="image/*" onChange={uploadAvatar}/><span className="upload-avatar-preview">{values.avatar ? <img src={values.avatar} alt="Selected avatar preview"/> : values.name.split(/\s+/).map((x) => x[0]).join('').slice(0,2).toUpperCase() || 'JC'}</span><span><strong>Add a profile photo</strong><small>Optional · max 2 MB</small></span></label>{values.avatar && <button type="button" className="remove-avatar" onClick={() => set('avatar', '')}>Remove</button>}</div>{errors.avatar && <span className="field-error">{errors.avatar}</span>}
        <p className="verification-note">College email verification is a future integration point. This demo does not verify your email or send a message.</p><div className="onboard-actions"><Button type="button" variant="secondary" icon={ChevronLeft} onClick={() => setStep(1)}>Back</Button><Button type="submit" icon={ChevronRight} disabled={saving}>{saving ? 'Creating profile…' : 'Create my profile'}</Button></div>
      </form>}
      <div className="onboard-step-indicator"><span className={step === 1 ? 'current' : 'done'}>1</span><i/><span className={step === 2 ? 'current' : ''}>2</span></div>
    </section></div>}
  </div>;
}
