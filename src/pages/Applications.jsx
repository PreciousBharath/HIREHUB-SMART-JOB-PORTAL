import { useState } from 'react'
import { KanbanSquare, Trash2, LayoutList, Columns3 } from 'lucide-react'
import { useHub } from '../hub.jsx'
import { STAGES, ago } from '../data.js'
import { Logo, JobModal } from '../components/Job.jsx'
import Empty from '../components/Empty.jsx'

export default function Applications() {
  const hub = useHub()
  const [view, setView] = useState('board')
  const [open, setOpen] = useState(null)
  const apps = hub.myApps.map((a) => ({ ...a, job: hub.jobs.find((j) => j.id === a.jobId) })).filter((a) => a.job)
  if (!apps.length) return <Empty icon={KanbanSquare} title="No applications yet" text="Find a job you love and hit Apply." />

  const Timeline = ({ a }) => (
    <div className="row" style={{ gap: 4 }}>{STAGES.filter((s) => s.id !== 'rejected').map((s, i) => {
      const reached = a.history.some((h) => h.s === s.id)
      return <div key={s.id} title={s.label} style={{ flex: 1, height: 6, borderRadius: 9, background: a.status === 'rejected' ? (i === 0 ? s.color : 'var(--danger)') : reached ? s.color : 'var(--bg-2)', transition: 'background .5s' }} />
    })}</div>
  )

  return (
    <div className="col" style={{ gap: 18 }}>
      <div className="tabs"><button className={view === 'board' ? 'active' : ''} onClick={() => setView('board')}><Columns3 size={14} /> Board</button><button className={view === 'list' ? 'active' : ''} onClick={() => setView('list')}><LayoutList size={14} /> Timeline</button></div>
      {view === 'board' ? (
        <div className="row" style={{ alignItems: 'flex-start', overflowX: 'auto', gap: 14, paddingBottom: 10 }}>
          {STAGES.map((s) => { const col = apps.filter((a) => a.status === s.id); return (
            <div key={s.id} className="card col" style={{ minWidth: 240, flex: 1, background: 'var(--bg-2)', padding: 14 }}>
              <div className="row between"><span className="row bold"><span style={{ width: 10, height: 10, borderRadius: 3, background: s.color }} />{s.label}</span><span className="badge">{col.length}</span></div>
              <div className="col stagger">{col.map((a) => (
                <div key={a.id} className="card hover col" style={{ padding: 12, cursor: 'pointer', gap: 8 }} onClick={() => setOpen(a.jobId)}>
                  <div className="row"><Logo job={a.job} size={34} /><div><div className="bold small">{a.job.title}</div><div className="xs muted">{a.job.company}</div></div></div>
                  <Timeline a={a} /><div className="xs muted">Applied {ago(a.at).toLowerCase()}</div>
                </div>))}</div>
            </div>) })}
        </div>
      ) : (
        <div className="col stagger">{apps.map((a) => (
          <div key={a.id} className="card col">
            <div className="row between wrap"><div className="row"><Logo job={a.job} /><div><b>{a.job.title}</b><div className="small muted">{a.job.company} · expected ₹{a.ctc} LPA</div></div></div>
              <div className="row"><span className="badge" style={{ background: STAGES.find((s) => s.id === a.status).color, color: '#fff' }}>{a.status}</span><button className="btn ghost icon sm" onClick={() => confirm('Withdraw this application?') && hub.withdraw(a.id)}><Trash2 size={14} /></button></div></div>
            <Timeline a={a} />
            <div className="row wrap xs muted">{a.history.map((h, i) => <span key={i}>● {STAGES.find((s) => s.id === h.s)?.label} — {new Date(h.at).toLocaleDateString()}</span>)}</div>
          </div>))}</div>
      )}
      {open && <JobModal id={open} onClose={() => setOpen(null)} />}
    </div>
  )
}
