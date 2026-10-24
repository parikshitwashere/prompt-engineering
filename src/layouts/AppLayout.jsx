import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Compass, House, LayoutDashboard, Plus, UserRound, ArrowUpRight, Sun, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCommunity } from '../context/CommunityContext.jsx';
import { getStudent } from '../utils/helpers.js';
import { Avatar, Logo } from '../components/ui.jsx';

const navItems = [
  { to: '/home', label: 'Home', icon: House },
  { to: '/explore', label: 'Explore', icon: Compass },
  { to: '/dashboard', label: 'My dashboard', icon: LayoutDashboard },
  { to: '/profile', label: 'My profile', icon: UserRound },
];

export default function AppLayout() {
  const { state, chooseDemo } = useCommunity();
  const student = getStudent(state.students, state.currentUserId) || state.students[0];
  const navigate = useNavigate();
  const location = useLocation();
  const active = (to) => location.pathname === to || (to === '/home' && location.pathname === '/');
  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <Link className="brand-link" to="/home" aria-label="JIET Community home"><Logo /><span className="brand-name">JIET <b>Community</b></span></Link>
          <nav className="desktop-nav" aria-label="Main navigation">
            {navItems.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}><Icon size={17} strokeWidth={1.8} /><span>{label}</span></NavLink>)}
          </nav>
          <div className="topbar-actions">
            <button className="icon-button search-shortcut" type="button" aria-label="Explore activities" onClick={() => navigate('/explore')}><Search size={18} /></button>
            <span className="demo-pill"><span className="status-dot" /> Demo mode</span>
            <button className="account-button" type="button" onClick={() => navigate('/profile')} aria-label={`Open ${student?.name || 'student'} profile`}><Avatar student={student} size="sm" /><span className="account-name">{student?.name?.split(' ')[0] || 'Student'}</span><ArrowUpRight size={14} className="account-arrow" /></button>
          </div>
        </div>
      </header>
      <main className="page-content" key={location.pathname}>
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.22, ease: 'easeOut' }}>
          <Outlet />
        </motion.div>
      </main>
      <nav className="mobile-nav" aria-label="Mobile navigation">
        {navItems.slice(0, 2).map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}><Icon size={20} /><span>{label}</span></NavLink>)}
        <button className="mobile-publish" type="button" onClick={() => navigate('/publish')} aria-label="Publish an activity"><Plus size={21} /></button>
        {navItems.slice(2).map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}><Icon size={20} /><span>{label === 'My dashboard' ? 'Dashboard' : 'Profile'}</span></NavLink>)}
      </nav>
      <button className="desktop-publish" onClick={() => navigate('/publish')} type="button"><Plus size={17} /> Publish an idea</button>
      <div className="demo-footer"><Sun size={13} /> Demo content is stored in this browser only. <button type="button" onClick={() => { chooseDemo(); navigate('/home'); }}>Use demo profile</button></div>
    </div>
  );
}
