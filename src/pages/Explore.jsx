import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CalendarDays, Grid2X2, List, Plus, Search, SlidersHorizontal, X, ArrowDownWideNarrow } from 'lucide-react';
import { useCommunity } from '../context/CommunityContext.jsx';
import { Button, EmptyState, PageHeader } from '../components/ui.jsx';
import ActivityCard from '../components/ActivityCard.jsx';
import { getStudent, spotsLeft } from '../utils/helpers.js';

const categories = ['All Activities', 'Sports and Games', 'Projects and Technology', 'Academics and Study Groups', 'Hackathons and Competitions', 'Events and Culture', 'Fitness and Wellness', 'Creative Arts', 'Volunteering', 'Other'];
const branches = ['Computer Science and Engineering', 'Computer Science and Engineering - AI and ML', 'Information Technology', 'Electronics and Communication Engineering', 'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering', 'Other'];
const years = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Other'];
const skills = ['Beginner friendly', 'Intermediate', 'Advanced', 'All skill levels'];

export default function Explore() {
  const { state } = useCommunity();
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(() => params.get('q') || '');
  const [category, setCategory] = useState(() => params.get('category') || 'All Activities');
  const [branch, setBranch] = useState(() => params.get('branch') || '');
  const [year, setYear] = useState(() => params.get('year') || '');
  const [skill, setSkill] = useState(() => params.get('skill') || '');
  const [dateRange, setDateRange] = useState(() => params.get('date') || '');
  const [location, setLocation] = useState(() => params.get('location') || '');
  const [available, setAvailable] = useState(() => params.get('available') === 'true');
  const [targeted, setTargeted] = useState(() => params.get('targeted') === 'true');
  const [sort, setSort] = useState(() => params.get('sort') || 'soonest');
  const [view, setView] = useState(() => params.get('view') || 'grid');
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    const next = new URLSearchParams();
    if (query.trim()) next.set('q', query.trim());
    if (category !== 'All Activities') next.set('category', category);
    if (branch) next.set('branch', branch);
    if (year) next.set('year', year);
    if (skill) next.set('skill', skill);
    if (dateRange) next.set('date', dateRange);
    if (location.trim()) next.set('location', location.trim());
    if (available) next.set('available', 'true');
    if (targeted) next.set('targeted', 'true');
    if (sort !== 'soonest') next.set('sort', sort);
    if (view !== 'grid') next.set('view', view);
    setParams(next, { replace: true });
  }, [query, category, branch, year, skill, dateRange, location, available, targeted, sort, view, setParams]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const now = Date.now();
    const list = state.activities.filter((item) => {
      const organizer = getStudent(state.students, item.organizerId);
      const haystack = [item.title, item.description, item.category, item.location, organizer?.name, ...item.tags].join(' ').toLowerCase();
      if (needle && !haystack.includes(needle)) return false;
      if (category !== 'All Activities' && item.category !== category) return false;
      if (branch && !item.eligibleBranches.includes('All') && !item.eligibleBranches.includes(branch) && organizer?.branch !== branch) return false;
      if (year && !item.eligibleYears.includes('All') && !item.eligibleYears.includes(year) && organizer?.year !== year) return false;
      if (skill && item.skillLevel !== skill) return false;
      if (location && !item.location.toLowerCase().includes(location.toLowerCase())) return false;
      if (available && (item.status !== 'open' || spotsLeft(item) <= 0)) return false;
      if (targeted && item.eligibleBranches.includes('All') && item.eligibleYears.includes('All')) return false;
      const datePart = new Date(item.date).toISOString().slice(0, 10);
      const eventAt = new Date(`${datePart}T${item.startTime || '00:00'}:00`).getTime();
      if (dateRange === 'week' && (eventAt < now || eventAt > now + 7 * 864e5)) return false;
      if (dateRange === 'month' && (eventAt < now || eventAt > now + 30 * 864e5)) return false;
      return true;
    });
    return list.sort((a, b) => sort === 'newest'
      ? new Date(b.createdAt) - new Date(a.createdAt)
      : sort === 'popular'
        ? b.participantIds.length - a.participantIds.length
        : sort === 'available'
          ? spotsLeft(b) - spotsLeft(a)
          : new Date(a.date) - new Date(b.date));
  }, [state.activities, state.students, query, category, branch, year, skill, dateRange, location, available, targeted, sort]);

  const clearFilters = () => {
    setQuery(''); setCategory('All Activities'); setBranch(''); setYear(''); setSkill('');
    setDateRange(''); setLocation(''); setAvailable(false); setTargeted(false); setSort('soonest'); setView('grid');
  };
  const activeCount = [branch, year, skill, dateRange, location, available, targeted].filter(Boolean).length;
  const activeFilters = [
    query.trim() && { label: `Search: ${query.trim()}`, clear: () => setQuery('') },
    category !== 'All Activities' && { label: category, clear: () => setCategory('All Activities') },
    branch && { label: `Branch: ${branch}`, clear: () => setBranch('') },
    year && { label: `Year: ${year}`, clear: () => setYear('') },
    skill && { label: `Skill: ${skill}`, clear: () => setSkill('') },
    dateRange && { label: dateRange === 'week' ? 'Next 7 days' : 'Next 30 days', clear: () => setDateRange('') },
    location.trim() && { label: `Location: ${location.trim()}`, clear: () => setLocation('') },
    available && { label: 'Open spots', clear: () => setAvailable(false) },
    targeted && { label: 'Group-specific', clear: () => setTargeted(false) },
  ].filter(Boolean);
  const filterFields = <>
    <div className="filter-select"><label htmlFor="filter-branch">Branch</label><select id="filter-branch" className="select" value={branch} onChange={(event) => setBranch(event.target.value)}><option value="">Any branch</option>{branches.map((item) => <option key={item}>{item}</option>)}</select></div>
    <div className="filter-select"><label htmlFor="filter-year">Year</label><select id="filter-year" className="select" value={year} onChange={(event) => setYear(event.target.value)}><option value="">Any year</option>{years.map((item) => <option key={item}>{item}</option>)}</select></div>
    <div className="filter-select"><label htmlFor="filter-skill">Skill</label><select id="filter-skill" className="select" value={skill} onChange={(event) => setSkill(event.target.value)}><option value="">Any skill level</option>{skills.map((item) => <option key={item}>{item}</option>)}</select></div>
    <div className="filter-select"><label htmlFor="filter-date">Date</label><select id="filter-date" className="select" value={dateRange} onChange={(event) => setDateRange(event.target.value)}><option value="">Any date</option><option value="week">Next 7 days</option><option value="month">Next 30 days</option></select></div>
    <div className="filter-select location-filter"><label htmlFor="filter-location">Location</label><input id="filter-location" className="input" value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Search a place"/></div>
    <div className="filter-checks"><label><input type="checkbox" checked={available} onChange={(event) => setAvailable(event.target.checked)}/> Open spots</label><label><input type="checkbox" checked={targeted} onChange={(event) => setTargeted(event.target.checked)}/> Group-specific</label></div>
  </>;

  return <div className="explore-page">
    <PageHeader eyebrow="DISCOVER ACROSS JIET" title="Find your next thing." description="Discover people, projects, games, and experiences happening across JIET." action={<Link to="/publish"><Button icon={Plus}>Create an activity</Button></Link>}/>
    <div className="explore-search-row"><label className="search-box"><Search size={18}/><input aria-label="Search activities" placeholder="Search activities, people, tags…" value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') event.preventDefault(); }}/>{query && <button type="button" aria-label="Clear search" onClick={() => setQuery('')}><X size={15}/></button>}</label><Button variant={filtersOpen ? 'soft' : 'secondary'} icon={SlidersHorizontal} onClick={() => setFiltersOpen((open) => !open)}>Filters{activeCount ? ` · ${activeCount}` : ''}</Button></div>
    {filtersOpen && <section className="filter-panel surface" aria-label="Activity filters"><div className="filter-panel-grid">{filterFields}</div><button className="clear-filters" type="button" onClick={clearFilters}>Clear all filters</button></section>}
    <div className="category-scroll" aria-label="Activity category filters">{categories.map((item) => <button key={item} type="button" className={`chip ${category === item ? 'selected' : ''}`} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}</div>
    {activeFilters.length > 0 && <div className="active-filter-row" aria-label="Active filters">{activeFilters.map((item) => <button className="chip selected" type="button" key={item.label} onClick={item.clear} aria-label={`Remove filter ${item.label}`}>{item.label} <X size={12}/></button>)}<button className="clear-filters" type="button" onClick={clearFilters}>Clear all</button></div>}
    <div className="results-toolbar"><div><strong>{filtered.length}</strong> activities <span>· updated as you filter</span></div><div className="results-options"><label className="sort-select"><ArrowDownWideNarrow size={15}/><span className="sr-only">Sort activities</span><select aria-label="Sort activities" value={sort} onChange={(event) => setSort(event.target.value)}><option value="soonest">Soonest</option><option value="newest">Newest</option><option value="popular">Most popular</option><option value="available">Most available</option></select></label><div className="view-toggle" role="group" aria-label="Activity layout"><button type="button" className={view === 'grid' ? 'active' : ''} aria-label="Grid view" aria-pressed={view === 'grid'} onClick={() => setView('grid')}><Grid2X2 size={16}/></button><button type="button" className={view === 'list' ? 'active' : ''} aria-label="List view" aria-pressed={view === 'list'} onClick={() => setView('list')}><List size={17}/></button></div></div></div>
    {filtered.length ? <div className={`card-grid explore-results ${view === 'list' ? 'list-layout' : ''}`}>{filtered.map((activity) => <ActivityCard key={activity.id} activity={activity} students={state.students} list={view === 'list'}/>)}</div> : <EmptyState icon={CalendarDays} title="No activities found" action={<div className="empty-actions"><Button variant="secondary" onClick={clearFilters}>Clear filters</Button><Link to="/publish"><Button icon={Plus}>Publish an activity</Button></Link></div>}>Try broadening your search or clearing a filter. There is always room for a new idea.</EmptyState>}
  </div>;
}
