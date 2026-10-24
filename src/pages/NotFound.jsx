import { Link } from 'react-router-dom';
import { ArrowLeft, Compass, Map } from 'lucide-react';
import { Button, Logo } from '../components/ui.jsx';

export default function NotFound() {
  return <div className="not-found-page"><Link className="brand-link" to="/home"><Logo/><span className="brand-name">JIET <b>Community</b></span></Link><div className="not-found-art"><span>4</span><div className="not-found-orbit"><Map size={29}/></div><span>4</span></div><span className="eyebrow">A LITTLE OFF THE MAP</span><h1>This page isn't in the plan.</h1><p>Maybe the activity moved, or the link took a wrong turn. Your next campus idea is still out there.</p><div className="not-found-actions"><Link to="/home"><Button icon={ArrowLeft}>Back to Home</Button></Link><Link to="/explore"><Button variant="secondary" icon={Compass}>Explore activities</Button></Link></div></div>;
}
