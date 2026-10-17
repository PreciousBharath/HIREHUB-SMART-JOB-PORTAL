import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Rocket, X } from 'lucide-react'
import { useHub } from '../hub.jsx'
import { useAuth } from '../auth.jsx'
import { JobCard } from '../components/Job.jsx'

const blank = { title: '', company: '', logo: '🏢', color: '#6366f1', location: '', work: 'Hybrid', type: 'Full-time', expMin: 0, expMax: 3, salaryMin: 5, salaryMax: 10, openings: 1, skills: [], description: '', dept: 'Engineering' }

export default function PostJob() {
  const { postJob } = useHub()
  const { user, updateProfile } = useAuth()
  const nav = useNavigate()
  const [j, setJ] = useState({ ...blank, company: user.company || '' })
  const [skill, setSkill] = useState('')
  const set = (k, num) => (e) => setJ({ ...j, [k]: num ? +e.target.value : e.target.value })
  const preview = { ...j, id: 'preview', companyId: 'x', posted: Date.now(), applicants: 0, status: 'open', responsibilities: [], perks: [], title: j.title || 'Job title', company: j.company || 'Your company', location: j.location || 'Location', skills: j.skills.length ? j.skills : ['Skill'] }

  const submit = (e) => {
    e.preventDefault()
    if (!j.skills.length) return alert('Add at least one skill')
    if (user.role !== 'employer') updateProfile({ role: 'employer' })
    updateProfile({ company: j.company })
    postJob({ ...j, responsibilities: ['Deliver high-quality work', 'Collaborate with the team', 'Own outcomes end-to-end'], perks: ['Flexible hours', 'Health insurance'] })
    nav('/manage')
  }

  return (
    <div className="grid" style={{ gridTemplateColumns: 'minmax(0, 1.4fr) minmax(280px, 1fr)', gap: 18 }}>
      <form className="card col fade-up" onSubmit={submit}>
        <div className="section-title"><Rocket size={18} /> Post a new job</div>
        <div className="grid grid-2">
          <div className="field"><label>Job title</label><input className="input" required value={j.title} onChange={set('title')} /></div>
          <div className="field"><label>Company</label><input className="input" required value={j.company} onChange={set('company')} /></div>
          <div className="field"><label>Location</label><input className="input" required value={j.location} onChange={set('location')} /></div>
          <div className="field"><label>Logo emoji & brand colour</label><div className="row"><select className="input" value={j.logo} onChange={set('logo')}>{['🏢', '🚀', '💡', '🌿', '🛡️', '🎨', '📊', '🤖'].map((x) => <option key={x}>{x}</option>)}</select><input type="color" value={j.color} onChange={set('color')} style={{ width: 54, height: 44, border: 'none', background: 'none' }} /></div></div>
          <div className="field"><label>Work mode</label><select className="input" value={j.work} onChange={set('work')}>{['On-site', 'Hybrid', 'Remote'].map((x) => <option key={x}>{x}</option>)}</select></div>
          <div className="field"><label>Job type</label><select className="input" value={j.type} onChange={set('type')}>{['Full-time', 'Part-time', 'Contract', 'Internship'].map((x) => <option key={x}>{x}</option>)}</select></div>
          <div className="field"><label>Experience: {j.expMin}-{j.expMax} yrs</label><div className="row"><input className="input" type="number" min="0" value={j.expMin} onChange={set('expMin', 1)} /><input className="input" type="number" min="0" value={j.expMax} onChange={set('expMax', 1)} /></div></div>
          <div className="field"><label>Salary (LPA): {j.salaryMin}-{j.salaryMax}</label><div className="row"><input className="input" type="number" min="0" value={j.salaryMin} onChange={set('salaryMin', 1)} /><input className="input" type="number" min="0" value={j.salaryMax} onChange={set('salaryMax', 1)} /></div></div>
        </div>
        <div className="field"><label>Required skills</label>
          <div className="row"><input className="input" placeholder="Press Enter to add" value={skill} onChange={(e) => setSkill(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); if (skill.trim()) setJ({ ...j, skills: [...j.skills, skill.trim()] }); setSkill('') } }} /></div>
          <div className="row wrap">{j.skills.map((s) => <span key={s} className="badge">{s} <X size={12} style={{ cursor: 'pointer' }} onClick={() => setJ({ ...j, skills: j.skills.filter((x) => x !== s) })} /></span>)}</div></div>
        <div className="field"><label>Description</label><textarea className="input" rows="4" required value={j.description} onChange={set('description')} /></div>
        <button className="btn"><Rocket size={17} /> Publish job</button>
      </form>
      <div className="col" style={{ gap: 10 }}><div className="xs muted bold">LIVE PREVIEW</div><div style={{ pointerEvents: 'none' }}><JobCard job={preview} onOpen={() => {}} /></div></div>
    </div>
  )
}
