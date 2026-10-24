import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Users } from 'lucide-react';
import { categoryTone } from '../utils/helpers.js';

export function Logo({ size = 35 }) {
  return <span className="logo-mark" style={{ width: size, height: size, borderRadius: Math.round(size * .34) }} aria-hidden="true"><svg viewBox="0 0 32 32" width={size * .7} height={size * .7} fill="none"><path d="M10.5 16h11M12.5 12.5l7 7M12.5 19.5l7-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><circle cx="8.5" cy="16" r="3.2" fill="currentColor"/><circle cx="23.5" cy="9.5" r="3.2" fill="currentColor"/><circle cx="23.5" cy="22.5" r="3.2" fill="currentColor"/></svg></span>;
}

export function Avatar({ student, size = 'md', className = '' }) {
  const sizes = { xs: 25, sm: 32, md: 40, lg: 58, xl: 84 };
  const px = sizes[size] || size;
  const initials = (student?.name || 'JIET Student').split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
  return <span className={`avatar ${className}`} style={{ width: px, height: px, fontSize: px * .31, background: student?.avatarColor || '#635BDB' }} aria-label={student?.name ? `Avatar for ${student.name}` : 'Student avatar'}>{student?.avatar ? <img src={student.avatar} alt="" /> : initials}</span>;
}

export function Button({ variant = 'primary', icon: Icon, children, className = '', ...props }) {
  return <button className={`btn btn-${variant} ${className}`} {...props}>{Icon && <Icon size={16} strokeWidth={2} />}{children}</button>;
}

export function Badge({ children, tone, icon: Icon }) {
  return <span className={`badge badge-${tone || 'violet'}`}>{Icon && <Icon size={12} />}{children}</span>;
}

export function CategoryBadge({ category }) {
  return <Badge tone={categoryTone(category)}>{category}</Badge>;
}

export function ParticipantGroup({ students = [], limit = 4, size = 'xs' }) {
  const shown = students.slice(0, limit);
  return <span className="avatar-group" aria-label={`${students.length} participants`}>
    {shown.map((student) => <Avatar key={student.id} student={student} size={size} />)}
    {students.length > limit && <span className="avatar extra-count" style={{ width: 25, height: 25, background: '#f0efff', color: '#5d5bd3', fontSize: 9 }}>+{students.length - limit}</span>}
  </span>;
}

export function EmptyState({ icon: Icon = Users, title, children, action }) {
  return <div className="empty-state"><div className="empty-icon"><Icon size={20} /></div><h3>{title}</h3><p>{children}</p>{action}</div>;
}

export function SectionHeading({ title, description, action, eyebrow }) {
  return <div className="section-heading"><div>{eyebrow && <span className="eyebrow">{eyebrow}</span>}<h2>{title}</h2>{description && <p>{description}</p>}</div>{action}</div>;
}

export function Field({ label, required, error, hint, id, children }) {
  return <div className="form-field"><label className="field-label" htmlFor={id}>{label}{required && <span aria-hidden="true"> *</span>}</label>{children}{error && <div className="field-error" role="alert">{error}</div>}{hint && !error && <span className="field-hint">{hint}</span>}</div>;
}

export function Modal({ open, onClose, title, description, children, labelledBy = 'modal-title' }) {
  const modalRef = useRef(null);
  const onCloseRef = useRef(onClose);
  useEffect(() => { onCloseRef.current = onClose; }, [onClose]);
  useEffect(() => {
    if (!open) return undefined;
    const previousFocus = document.activeElement;
    const dialog = modalRef.current;
    const getFocusable = () => [...(dialog?.querySelectorAll('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])') || [])].filter((element) => element.getClientRects().length > 0);
    (getFocusable()[0] || dialog)?.focus();
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') { event.stopPropagation(); onCloseRef.current?.(); return; }
      if (event.key !== 'Tab') return;
      const focusable = getFocusable();
      if (!focusable.length) { event.preventDefault(); dialog?.focus(); return; }
      const first = focusable[0]; const last = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === first || !dialog?.contains(document.activeElement))) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && (document.activeElement === last || !dialog?.contains(document.activeElement))) { event.preventDefault(); first.focus(); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus();
    };
  }, [open]);
  return <AnimatePresence>{open && <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose?.(); }}><motion.section ref={modalRef} tabIndex={-1} className="modal-card" role="dialog" aria-modal="true" aria-labelledby={labelledBy} initial={{ opacity: 0, y: 14, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: .98 }} transition={{ duration: .18 }}><div className="modal-header"><div><h2 id={labelledBy}>{title}</h2>{description && <p>{description}</p>}</div><button type="button" className="icon-plain" onClick={onClose} aria-label="Close dialog"><X size={18} /></button></div>{children}</motion.section></motion.div>}</AnimatePresence>;
}

export function PageHeader({ eyebrow, title, description, action }) {
  return <div className="page-header"><div>{eyebrow && <span className="eyebrow">{eyebrow}</span>}<h1 className="page-title">{title}</h1>{description && <p className="page-subtitle">{description}</p>}</div>{action && <div className="page-header-action">{action}</div>}</div>;
}
