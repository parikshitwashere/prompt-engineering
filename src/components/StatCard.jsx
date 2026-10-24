import { ArrowUpRight } from 'lucide-react';
export default function StatCard({ label, value, detail, icon: Icon, tone = 'violet' }) {
  return <div className={`surface stat-card stat-${tone}`}><div className="stat-top"><span className="stat-icon"><Icon size={18} /></span><ArrowUpRight size={15} className="stat-arrow" /></div><strong>{value}</strong><span className="stat-label">{label}</span>{detail && <small>{detail}</small>}</div>;
}
