import { useState } from 'react'
import { MapPin, Bookmark, BookmarkCheck, Clock, Briefcase, IndianRupee, Users, Send, CheckCircle2 } from 'lucide-react'
import Modal from './Modal.jsx'
import { useHub } from '../hub.jsx'
import { useAuth } from '../auth.jsx'
import { matchScore, ago } from '../data.js'

export function MatchRing({ value, size = 52 }) {
  const r = (size - 8) / 2, c = 2 * Math.PI * r
  const color = value >= 75 ? 'var(--success)' : value >= 45 ? 'var(--warning)' : 'var(--danger)'
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }} title="Skill match">
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="var(--bg-2)" strokeWidth="6" fill="none" />
        <circle cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth="6" fill="none" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - value / 100)} style={{ transition: 'stroke-dashoffset 1s cubic-bezier(.2,.8,.2,1)' }} />
      </svg>
      <span style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', fontSize: size * 0.24, fontWeight: 800 }}>{value}%</span>
    </div>
  )
}

export const Logo = ({ job, size = 46 }) => (
  <div style={{ width: size, height: size, borderRadius: 14, background: `color-mix(in srgb, ${job.color} 18%, transparent)`, display: 'grid', placeItems: 'center', fontSize: size * 0.5, flexShrink: 0 }}>{job.logo}</div>
)

export function JobCard({ job, onOpen }) {
  const { saved, toggleSave, resume, myApps } = useHub()
  const applied = myApps.some((a) => a.jobId === job.id)
  return (
    <div className="card hover col" style={{ cursor: 'pointer', gap: 12 }} onClick={() => onOpen(job.id)}>
      <div className="row between" style={{ alignItems: 'flex-start' }}>
        <div className="row"><Logo job={job} /><div><div className="bold">{job.title}</div><div className="small muted">{job.company}</div></div></div>
        <MatchRing value={matchScore(job, resume)} />
      </div>
      <div className="row wrap small muted" style={{ gap: 12 }}>
        <span className="row" style={{ gap: 4 }}><MapPin size={14} />{job.location}</span>
        <span className="row" style={{ gap: 4 }}><Briefcase size={14} />{job.expMin}-{job.expMax} yrs</span>
        <span className="row" style={{ gap: 4 }}><IndianRupee size={14} />{job.salaryMin}-{job.salaryMax} LPA</span>
      </div>
      <div className="row wrap" style={{ gap: 6 }}>{job.skills.map((s) => <span key={s} className="badge">{s}</span>)}</div>
      <div className="row between">
        <div className="row" style={{ gap: 6 }}><span className="badge green">{job.type}</span><span className="badge amber">{job.work}</span>{job.status === 'closed' && <span className="badge red">Closed</span>}</div>
        <div className="row">
          {applied && <CheckCircle2 size={18} color="var(--success)" />}
          <span className="xs muted">{ago(job.posted)}</span>
          <button className="btn ghost icon sm" onClick={(e) => { e.stopPropagation(); toggleSave(job.id) }}>{saved.includes(job.id) ? <BookmarkCheck size={16} color="var(--accent)" /> : <Bookmark size={16} />}</button>
        </div>
      </div>
    </div>
  )
}

export function JobModal({ id, onClose }) {
  const { jobs, apply, myApps, resume, saved, toggleSave } = useHub()
  const { user } = useAuth()
  const job = jobs.find((j) => j.id === id)
  const applied = myApps.find((a) => a.jobId === id)
  const [form, setForm] = useState({ cover: '', ctc: '', notice: '30 days', portfolio: resume.links || '' })
  const [step, setStep] = useState(0)
  const score = matchScore(job, resume)
  const missing = job.skills.filter((s) => !resume.skills.map((x) => x.toLowerCase()).includes(s.toLowerCase()))

  return (
    <Modal title="" onClose={onClose} width={760}>
      <div className="row between wrap" style={{ marginTop: -36 }}>
        <div className="row"><Logo job={job} size={58} /><div><h2 style={{ fontWeight: 800 }}>{job.title}</h2><div className="muted">{job.company} · {job.location} · {job.work}</div></div></div>
        <MatchRing value={score} size={70} />
      </div>
      <div className="grid grid-4 mt small">
        <div className="card" style={{ padding: 12 }}><div className="muted">Salary</div><b>₹{job.salaryMin}-{job.salaryMax} LPA</b></div>
        <div className="card" style={{ padding: 12 }}><div className="muted">Experience</div><b>{job.expMin}-{job.expMax} years</b></div>
        <div className="card" style={{ padding: 12 }}><div className="muted">Type</div><b>{job.type}</b></div>
        <div className="card" style={{ padding: 12 }}><div className="muted">Applicants</div><b className="row" style={{ gap: 4 }}><Users size={14} />{job.applicants} · {job.openings} openings</b></div>
      </div>
      <p className="mt">{job.description}</p>
      <div className="mt"><b>Responsibilities</b><ul style={{ paddingLeft: 20, marginTop: 6 }} className="small">{job.responsibilities.map((r) => <li key={r}>{r}</li>)}</ul></div>
      <div className="mt row wrap"><b>Skills:</b>{job.skills.map((s) => <span key={s} className={`badge ${missing.includes(s) ? 'red' : 'green'}`}>{missing.includes(s) ? '✕' : '✓'} {s}</span>)}</div>
      <div className="mt row wrap"><b>Perks:</b>{job.perks.map((p) => <span key={p} className="chip" style={{ cursor: 'default' }}>{p}</span>)}</div>
      {missing.length > 0 && <p className="xs muted mt">💡 Add {missing.join(', ')} to your resume to raise your match score.</p>}

      <div className="card mt col">
        {applied ? <div className="row"><CheckCircle2 color="var(--success)" /> You applied {ago(applied.at).toLowerCase()} · status <span className="badge">{applied.status}</span></div>
          : job.status === 'closed' ? <div className="muted">This job is no longer accepting applications.</div>
          : user.role === 'employer' ? <div className="muted small">Switch to the job-seeker view on the dashboard to apply.</div>
          : step === 0 ? (
            <div className="row between wrap"><span className="small muted"><Clock size={14} /> Posted {ago(job.posted).toLowerCase()}</span>
              <div className="row"><button className="btn ghost" onClick={() => toggleSave(id)}>{saved.includes(id) ? 'Saved ✓' : 'Save'}</button><button className="btn" onClick={() => setStep(1)}><Send size={16} /> Apply now</button></div></div>
          ) : (
            <form className="col fade-up" onSubmit={(e) => { e.preventDefault(); apply(id, { ...form, ctc: +form.ctc }); setStep(0) }}>
              <b>Quick apply as {user.name}</b>
              <textarea className="input" rows="3" required placeholder="Why are you a great fit? (cover note)" value={form.cover} onChange={(e) => setForm({ ...form, cover: e.target.value })} />
              <div className="grid grid-3">
                <input className="input" type="number" required placeholder="Expected CTC (LPA)" value={form.ctc} onChange={(e) => setForm({ ...form, ctc: e.target.value })} />
                <select className="input" value={form.notice} onChange={(e) => setForm({ ...form, notice: e.target.value })}>{['Immediate', '15 days', '30 days', '60 days', '90 days'].map((n) => <option key={n}>{n}</option>)}</select>
                <input className="input" placeholder="Portfolio / GitHub" value={form.portfolio} onChange={(e) => setForm({ ...form, portfolio: e.target.value })} />
              </div>
              <div className="row"><button type="button" className="btn ghost" onClick={() => setStep(0)}>Back</button><button className="btn"><Send size={16} /> Submit application</button></div>
            </form>
          )}
      </div>
    </Modal>
  )
}
