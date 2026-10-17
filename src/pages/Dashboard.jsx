import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts'
import { Send, CalendarCheck, Award, Bookmark, Briefcase, Users, Repeat, Sparkles } from 'lucide-react'
import StatCard from '../components/StatCard.jsx'
import { JobCard, JobModal } from '../components/Job.jsx'
import { useHub } from '../hub.jsx'
import { useAuth } from '../auth.jsx'
import { STAGES, matchScore } from '../data.js'

const tip = { background: 'var(--card-solid)', border: '1px solid var(--border)', borderRadius: 12 }

export default function Dashboard() {
  const { user, updateProfile } = useAuth()
  const hub = useHub()
  const [open, setOpen] = useState(null)
  const employer = user.role === 'employer'
  const mine = hub.jobs.filter((j) => j.postedBy === user.id)
  const myApplicants = hub.apps.filter((a) => mine.some((j) => j.id === a.jobId))
  const list = employer ? myApplicants : hub.myApps
  const byStage = STAGES.map((s) => ({ ...s, count: list.filter((a) => a.status === s.id).length }))
  const recs = hub.jobs.filter((j) => j.status === 'open').map((j) => ({ j, s: matchScore(j, hub.resume) })).sort((a, b) => b.s - a.s).slice(0, 3)

  return (
    <div className="col" style={{ gap: 20 }}>
      <div className="card row between wrap fade-up" style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', color: '#fff' }}>
        <div><div style={{ fontSize: '1.5rem', fontWeight: 800 }}>Hi {user.name.split(' ')[0]} 👋</div><div style={{ opacity: 0.9 }}>{employer ? 'Here’s how your hiring is going.' : 'Here’s your job-search progress.'}</div></div>
        <button className="btn" style={{ background: 'rgba(255,255,255,.2)' }} onClick={() => updateProfile({ role: employer ? 'candidate' : 'employer' })}><Repeat size={16} /> Switch to {employer ? 'job-seeker' : 'employer'} view</button>
      </div>
      <div className="grid grid-4 stagger">
        {employer ? (<>
          <StatCard icon={Briefcase} label="Active postings" value={mine.filter((j) => j.status === 'open').length} />
          <StatCard icon={Users} label="Total applicants" value={myApplicants.length} />
          <StatCard icon={CalendarCheck} label="Interviews" value={byStage[2].count} />
          <StatCard icon={Award} label="Offers made" value={byStage[3].count} />
        </>) : (<>
          <StatCard icon={Send} label="Applications" value={hub.myApps.length} />
          <StatCard icon={CalendarCheck} label="Interviews" value={byStage[2].count} />
          <StatCard icon={Award} label="Offers" value={byStage[3].count} />
          <StatCard icon={Bookmark} label="Saved jobs" value={hub.saved.length} />
        </>)}
      </div>
      <div className="grid grid-2">
        <div className="card fade-up"><div className="section-title">Pipeline overview</div>
          <div style={{ height: 260 }}><ResponsiveContainer><BarChart data={byStage}><CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} /><XAxis dataKey="label" stroke="var(--muted)" fontSize={12} /><YAxis allowDecimals={false} stroke="var(--muted)" /><Tooltip contentStyle={tip} cursor={{ fill: 'var(--bg-2)' }} /><Bar dataKey="count" radius={[8, 8, 0, 0]}>{byStage.map((s) => <Cell key={s.id} fill={s.color} />)}</Bar></BarChart></ResponsiveContainer></div>
        </div>
        <div className="card fade-up col"><div className="section-title"><Sparkles size={18} /> {employer ? 'Latest applicants' : 'Top matches for you'}</div>
          {employer ? (myApplicants.length ? myApplicants.slice(0, 5).map((a) => (
            <div key={a.id} className="row between small"><span className="row"><span className="avatar" style={{ width: 32, height: 32, fontSize: 12 }}>{a.name[0]}</span><span><b>{a.name}</b><div className="xs muted">{hub.jobs.find((j) => j.id === a.jobId)?.title}</div></span></span><span className="badge">{a.status}</span></div>
          )) : <p className="muted small">Post a job to start receiving applicants.</p>)
            : recs.map(({ j }) => <JobCard key={j.id} job={j} onOpen={setOpen} />)}
        </div>
      </div>
      {open && <JobModal id={open} onClose={() => setOpen(null)} />}
    </div>
  )
}
