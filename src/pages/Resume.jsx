import { useState } from 'react'
import { Plus, X, Save, FileUser, GraduationCap, Link2, MapPin } from 'lucide-react'
import { useHub } from '../hub.jsx'
import { useAuth } from '../auth.jsx'
import { useToast } from '../toast.jsx'

const SUGGEST = ['React', 'JavaScript', 'TypeScript', 'Python', 'SQL', 'Node.js', 'AWS', 'Docker', 'Figma', 'Power BI', 'TensorFlow', 'LLMs', 'Django', 'MongoDB', 'Excel', 'Communication', 'SEO', 'Linux']

export default function Resume() {
  const { resume, setResume } = useHub()
  const { user } = useAuth()
  const notify = useToast()
  const [r, setR] = useState(resume)
  const [skill, setSkill] = useState('')
  const addSkill = (s) => { s = s.trim(); if (s && !r.skills.some((x) => x.toLowerCase() === s.toLowerCase())) setR({ ...r, skills: [...r.skills, s] }); setSkill('') }
  const checks = [['Headline', !!r.headline], ['5+ skills', r.skills.length >= 5], ['Experience', r.experience > 0], ['Location', !!r.location], ['Education', !!r.education], ['Links', !!r.links]]
  const pct = Math.round((checks.filter((c) => c[1]).length / checks.length) * 100)

  return (
    <div className="grid" style={{ gridTemplateColumns: 'minmax(0, 1.4fr) minmax(280px, 1fr)', gap: 18 }}>
      <form className="card col fade-up" onSubmit={(e) => { e.preventDefault(); setResume(r); notify('Resume saved — match scores updated', 'success') }}>
        <div className="section-title"><FileUser size={18} /> Resume builder</div>
        <div className="field"><label>Headline</label><input className="input" placeholder="e.g. React developer who loves clean UI" value={r.headline} onChange={(e) => setR({ ...r, headline: e.target.value })} /></div>
        <div className="grid grid-3">
          <div className="field"><label>Experience (years)</label><input className="input" type="number" min="0" max="40" value={r.experience} onChange={(e) => setR({ ...r, experience: +e.target.value })} /></div>
          <div className="field"><label>Location</label><input className="input" value={r.location} onChange={(e) => setR({ ...r, location: e.target.value })} /></div>
          <div className="field"><label>Education</label><input className="input" value={r.education} onChange={(e) => setR({ ...r, education: e.target.value })} /></div>
        </div>
        <div className="field"><label>Links (GitHub / portfolio)</label><input className="input" value={r.links} onChange={(e) => setR({ ...r, links: e.target.value })} /></div>
        <div className="field"><label>Skills (used for job matching)</label>
          <div className="row"><input className="input" placeholder="Type a skill and press Enter" value={skill} onChange={(e) => setSkill(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(skill) } }} /><button type="button" className="btn icon" onClick={() => addSkill(skill)}><Plus size={18} /></button></div>
          <div className="row wrap">{r.skills.map((s) => <span key={s} className="badge" style={{ padding: '6px 10px' }}>{s} <X size={12} style={{ cursor: 'pointer' }} onClick={() => setR({ ...r, skills: r.skills.filter((x) => x !== s) })} /></span>)}</div>
          <div className="row wrap xs">{SUGGEST.filter((s) => !r.skills.includes(s)).map((s) => <button type="button" key={s} className="chip" style={{ padding: '4px 10px', fontSize: '.75rem' }} onClick={() => addSkill(s)}>+ {s}</button>)}</div>
        </div>
        <button className="btn"><Save size={17} /> Save resume</button>
      </form>
      <div className="col" style={{ gap: 18 }}>
        <div className="card fade-up col">
          <div className="row between"><b>Profile strength</b><span className="gradient-text bold" style={{ fontSize: '1.4rem' }}>{pct}%</span></div>
          <div className="progress"><div style={{ width: `${pct}%` }} /></div>
          {checks.map(([l, ok]) => <div key={l} className="row small" style={{ color: ok ? 'var(--success)' : 'var(--muted)' }}>{ok ? '✓' : '○'} {l}</div>)}
        </div>
        <div className="card fade-up col" style={{ gap: 8 }}>
          <div className="xs muted">LIVE PREVIEW</div>
          <div style={{ fontSize: '1.3rem', fontWeight: 800 }}>{user.name}</div>
          <div className="gradient-text bold">{r.headline || 'Your headline'}</div>
          <div className="row small muted wrap"><MapPin size={14} />{r.location || '—'} · {r.experience} yrs · <GraduationCap size={14} />{r.education || '—'}</div>
          <div className="row small muted"><Link2 size={14} />{r.links || '—'}</div>
          <div className="row wrap">{r.skills.map((s) => <span key={s} className="badge">{s}</span>)}</div>
        </div>
      </div>
    </div>
  )
}
