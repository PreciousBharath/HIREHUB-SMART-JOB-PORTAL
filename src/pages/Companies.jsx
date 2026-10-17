import { useState } from 'react'
import { Star, MapPin, Users } from 'lucide-react'
import { COMPANIES } from '../data.js'
import { useHub } from '../hub.jsx'
import { JobModal } from '../components/Job.jsx'
import Modal from '../components/Modal.jsx'

export default function Companies() {
  const { jobs } = useHub()
  const [sel, setSel] = useState(null)
  const [open, setOpen] = useState(null)
  const c = COMPANIES.find((x) => x.id === sel)
  return (
    <>
      <div className="grid grid-3 stagger">{COMPANIES.map((co) => { const n = jobs.filter((j) => j.companyId === co.id && j.status === 'open').length; return (
        <div key={co.id} className="card hover col" style={{ cursor: 'pointer', overflow: 'hidden', padding: 0 }} onClick={() => setSel(co.id)}>
          <div style={{ height: 70, background: `linear-gradient(135deg, ${co.color}, color-mix(in srgb, ${co.color} 40%, #000))` }} />
          <div className="col" style={{ padding: 18, marginTop: -44, gap: 8 }}>
            <div style={{ width: 64, height: 64, borderRadius: 18, background: 'var(--card-solid)', display: 'grid', placeItems: 'center', fontSize: 32, boxShadow: 'var(--shadow)' }}>{co.logo}</div>
            <b style={{ fontSize: '1.1rem' }}>{co.name}</b>
            <div className="small muted">{co.about}</div>
            <div className="row wrap small" style={{ gap: 12 }}><span className="row" style={{ gap: 4 }}><Star size={14} fill="#fbbf24" color="#fbbf24" />{co.rating}</span><span className="row" style={{ gap: 4 }}><MapPin size={14} />{co.city}</span><span className="row" style={{ gap: 4 }}><Users size={14} />{co.size}</span></div>
            <div className="row between"><span className="badge">{co.industry}</span><span className="badge green">{n} open roles</span></div>
          </div>
        </div>) })}</div>
      {c && (
        <Modal title={`${c.logo} ${c.name}`} onClose={() => setSel(null)}>
          <p className="muted">{c.about} · {c.industry} · {c.size} employees · ⭐ {c.rating}</p>
          <div className="col mt">{jobs.filter((j) => j.companyId === c.id).map((j) => (
            <div key={j.id} className="row between card" style={{ padding: 12 }}><span><b>{j.title}</b><div className="xs muted">{j.location} · ₹{j.salaryMin}-{j.salaryMax} LPA</div></span><button className="btn sm" onClick={() => setOpen(j.id)}>View</button></div>))}</div>
        </Modal>
      )}
      {open && <JobModal id={open} onClose={() => setOpen(null)} />}
    </>
  )
}
