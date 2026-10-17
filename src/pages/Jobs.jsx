import { useMemo, useState } from 'react'
import { Search, MapPin, Briefcase, X } from 'lucide-react'
import { JobCard, JobModal } from '../components/Job.jsx'
import Empty from '../components/Empty.jsx'
import { useHub } from '../hub.jsx'
import { matchScore } from '../data.js'

export default function Jobs({ savedOnly = false }) {
  const hub = useHub()
  const [q, setQ] = useState('')
  const [loc, setLoc] = useState('')
  const [types, setTypes] = useState([])
  const [work, setWork] = useState([])
  const [salary, setSalary] = useState(0)
  const [exp, setExp] = useState(15)
  const [sort, setSort] = useState('match')
  const [open, setOpen] = useState(null)
  const locations = [...new Set(hub.jobs.map((j) => j.location))]
  const toggle = (arr, set, v) => set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v])

  const list = useMemo(() => hub.jobs
    .filter((j) => !savedOnly || hub.saved.includes(j.id))
    .filter((j) => `${j.title} ${j.company} ${j.skills.join(' ')}`.toLowerCase().includes(q.toLowerCase()))
    .filter((j) => !loc || j.location === loc)
    .filter((j) => !types.length || types.includes(j.type))
    .filter((j) => !work.length || work.includes(j.work))
    .filter((j) => j.salaryMax >= salary && j.expMin <= exp)
    .map((j) => ({ ...j, score: matchScore(j, hub.resume) }))
    .sort((a, b) => ({ match: b.score - a.score, recent: b.posted - a.posted, salary: b.salaryMax - a.salaryMax, popular: b.applicants - a.applicants }[sort])), [hub.jobs, hub.saved, hub.resume, q, loc, types, work, salary, exp, sort, savedOnly])

  const active = [loc, ...types, ...work].filter(Boolean)
  return (
    <div className="col" style={{ gap: 18 }}>
      <div className="card row wrap fade-up" style={{ padding: 12 }}>
        <div className="input-icon" style={{ flex: 2, minWidth: 220 }}><Search size={17} /><input className="input" placeholder="Job title, skill or company" value={q} onChange={(e) => setQ(e.target.value)} /></div>
        <div className="input-icon" style={{ flex: 1, minWidth: 180 }}><MapPin size={17} /><select className="input" style={{ paddingLeft: 40 }} value={loc} onChange={(e) => setLoc(e.target.value)}><option value="">All locations</option>{locations.map((l) => <option key={l}>{l}</option>)}</select></div>
        <select className="input" style={{ width: 170 }} value={sort} onChange={(e) => setSort(e.target.value)}><option value="match">Best match</option><option value="recent">Most recent</option><option value="salary">Highest salary</option><option value="popular">Most applied</option></select>
      </div>
      <div className="row wrap" style={{ alignItems: 'flex-start', gap: 18 }}>
        <aside className="card col" style={{ width: 250, flexShrink: 0 }}>
          <b>Job type</b>{['Full-time', 'Part-time', 'Contract', 'Internship'].map((t) => <label key={t} className="row small"><input type="checkbox" checked={types.includes(t)} onChange={() => toggle(types, setTypes, t)} style={{ accentColor: 'var(--accent)' }} />{t}</label>)}
          <b className="mt">Work mode</b>{['On-site', 'Hybrid', 'Remote'].map((t) => <label key={t} className="row small"><input type="checkbox" checked={work.includes(t)} onChange={() => toggle(work, setWork, t)} style={{ accentColor: 'var(--accent)' }} />{t}</label>)}
          <b className="mt">Min salary: ₹{salary} LPA</b><input type="range" min="0" max="30" value={salary} onChange={(e) => setSalary(+e.target.value)} style={{ accentColor: 'var(--accent)' }} />
          <b>My experience: {exp >= 15 ? 'Any' : `${exp} yrs`}</b><input type="range" min="0" max="15" value={exp} onChange={(e) => setExp(+e.target.value)} style={{ accentColor: 'var(--accent)' }} />
        </aside>
        <div className="col" style={{ flex: 1, minWidth: 280, gap: 14 }}>
          <div className="row wrap between"><span className="muted small"><Briefcase size={14} /> {list.length} jobs found</span>
            <div className="row wrap">{active.map((a) => <span key={a} className="badge">{a} <X size={12} style={{ cursor: 'pointer' }} onClick={() => { if (a === loc) setLoc(''); setTypes(types.filter((x) => x !== a)); setWork(work.filter((x) => x !== a)) }} /></span>)}</div></div>
          {!list.length ? <Empty icon={Briefcase} title={savedOnly ? 'No saved jobs' : 'No jobs match your filters'} text={savedOnly ? 'Bookmark jobs to find them here.' : 'Try widening your search.'} /> : (
            <div className="grid grid-2 stagger">{list.map((j) => <JobCard key={j.id} job={j} onOpen={setOpen} />)}</div>
          )}
        </div>
      </div>
      {open && <JobModal id={open} onClose={() => setOpen(null)} />}
    </div>
  )
}
