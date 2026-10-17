import { useState } from 'react'
import { Users, Trash2, Power, PlusCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useHub } from '../hub.jsx'
import { useAuth } from '../auth.jsx'
import { STAGES, ago } from '../data.js'
import { Logo } from '../components/Job.jsx'
import Empty from '../components/Empty.jsx'

export default function Manage() {
  const hub = useHub()
  const { user } = useAuth()
  const mine = hub.jobs.filter((j) => j.postedBy === user.id)
  const [sel, setSel] = useState(mine[0]?.id)
  if (!mine.length) return <Empty icon={Users} title="No job postings yet" text="Publish your first role to start hiring." action={<Link to="/post" className="btn"><PlusCircle size={16} /> Post a job</Link>} />
  const job = mine.find((j) => j.id === sel) || mine[0]
  const applicants = hub.apps.filter((a) => a.jobId === job.id)

  return (
    <div className="grid" style={{ gridTemplateColumns: 'minmax(260px, 1fr) minmax(0, 2fr)', gap: 18 }}>
      <div className="col stagger">{mine.map((j) => (
        <div key={j.id} className="card hover row" style={{ cursor: 'pointer', outline: j.id === job.id ? '2px solid var(--accent)' : 'none' }} onClick={() => setSel(j.id)}>
          <Logo job={j} size={38} /><div style={{ flex: 1 }}><b className="small">{j.title}</b><div className="xs muted">{hub.apps.filter((a) => a.jobId === j.id).length} applicants · {ago(j.posted)}</div></div>
          <span className={`badge ${j.status === 'open' ? 'green' : 'red'}`}>{j.status}</span>
        </div>))}</div>
      <div className="card fade-up col" key={job.id}>
        <div className="row between wrap"><div className="section-title" style={{ margin: 0 }}>{job.title} — applicants</div>
          <div className="row"><button className="btn ghost sm" onClick={() => hub.closeJob(job.id)}><Power size={14} /> {job.status === 'open' ? 'Close' : 'Reopen'}</button><button className="btn danger sm" onClick={() => confirm('Delete this job?') && hub.deleteJob(job.id)}><Trash2 size={14} /></button></div></div>
        {!applicants.length ? <p className="muted small">No applicants yet. Share the role — candidates who apply appear here instantly.</p> : (
          <div className="table-wrap"><table className="table">
            <thead><tr><th>Candidate</th><th>Cover note</th><th>CTC</th><th>Applied</th><th>Stage</th></tr></thead>
            <tbody>{applicants.map((a) => (
              <tr key={a.id}><td><b>{a.name}</b><div className="xs muted">{a.email}</div></td><td className="small" style={{ maxWidth: 220 }}>{a.cover}</td><td>₹{a.ctc} LPA</td><td className="small">{ago(a.at)}</td>
                <td><select className="input" style={{ padding: '6px 10px' }} value={a.status} onChange={(e) => hub.setStatus(a.id, e.target.value)}>{STAGES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}</select></td></tr>))}</tbody>
          </table></div>
        )}
      </div>
    </div>
  )
}
