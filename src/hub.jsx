import { createContext, useContext } from 'react'
import { useAuth } from './auth.jsx'
import { usePersistentState, useUserState, uid } from './storage.js'
import { useToast } from './toast.jsx'
import { SEED_JOBS } from './data.js'

const HubCtx = createContext(null)

/** Jobs & applications are shared across all accounts (so employers see candidates); saved jobs & resume are per-user. */
export function HubProvider({ children }) {
  const { user } = useAuth()
  const notify = useToast()
  const demo = user?.id === 'demo'
  const [jobs, setJobs] = usePersistentState('jobs', SEED_JOBS)
  const [apps, setApps] = usePersistentState('applications', [
    { id: 'a1', jobId: 'j1', userId: 'demo', name: 'Aarav Sharma', email: 'demo@hirehub.app', status: 'interview', cover: 'Excited to build delightful React UIs.', ctc: 9, at: Date.now() - 6 * 86400000, history: [{ s: 'applied', at: Date.now() - 6 * 86400000 }, { s: 'screening', at: Date.now() - 4 * 86400000 }, { s: 'interview', at: Date.now() - 86400000 }] },
    { id: 'a2', jobId: 'j2', userId: 'demo', name: 'Aarav Sharma', email: 'demo@hirehub.app', status: 'screening', cover: 'ML enthusiast with Kaggle experience.', ctc: 12, at: Date.now() - 3 * 86400000, history: [{ s: 'applied', at: Date.now() - 3 * 86400000 }, { s: 'screening', at: Date.now() - 86400000 }] },
    { id: 'a3', jobId: 'j4', userId: 'demo', name: 'Aarav Sharma', email: 'demo@hirehub.app', status: 'applied', cover: 'Strong SQL and Power BI skills.', ctc: 7, at: Date.now() - 86400000, history: [{ s: 'applied', at: Date.now() - 86400000 }] },
  ])
  const [saved, setSaved] = useUserState(user, 'saved', demo ? ['j3', 'j8', 'j14'] : [])
  const [resume, setResume] = useUserState(user, 'resume', demo
    ? { headline: 'Aspiring Full Stack & ML Developer', skills: ['React', 'JavaScript', 'Python', 'SQL', 'CSS', 'Node.js'], experience: 2, location: 'Bengaluru', education: 'B.E. Computer Science', links: 'github.com/aarav' }
    : { headline: '', skills: [], experience: 0, location: '', education: '', links: '' })

  const apply = (jobId, form) => {
    if (apps.some((a) => a.jobId === jobId && a.userId === user.id)) return notify('You already applied to this job', 'error')
    setApps([{ id: uid(), jobId, userId: user.id, name: user.name, email: user.email, ...form, status: 'applied', at: Date.now(), history: [{ s: 'applied', at: Date.now() }] }, ...apps])
    setJobs(jobs.map((j) => (j.id === jobId ? { ...j, applicants: j.applicants + 1 } : j)))
    notify('Application submitted 🎉', 'success')
  }
  const withdraw = (id) => { setApps(apps.filter((a) => a.id !== id)); notify('Application withdrawn') }
  const setStatus = (id, status) => setApps(apps.map((a) => (a.id === id ? { ...a, status, history: [...a.history, { s: status, at: Date.now() }] } : a)))
  const toggleSave = (id) => { const has = saved.includes(id); setSaved(has ? saved.filter((x) => x !== id) : [id, ...saved]); notify(has ? 'Removed from saved' : 'Job saved', has ? 'info' : 'success') }
  const postJob = (job) => { const j = { ...job, id: uid(), posted: Date.now(), applicants: 0, status: 'open', postedBy: user.id }; setJobs([j, ...jobs]); notify('Job published 🚀', 'success'); return j }
  const closeJob = (id) => setJobs(jobs.map((j) => (j.id === id ? { ...j, status: j.status === 'open' ? 'closed' : 'open' } : j)))
  const deleteJob = (id) => { setJobs(jobs.filter((j) => j.id !== id)); setApps(apps.filter((a) => a.jobId !== id)) }

  return (
    <HubCtx.Provider value={{ jobs, apps, saved, resume, setResume, apply, withdraw, setStatus, toggleSave, postJob, closeJob, deleteJob, myApps: apps.filter((a) => a.userId === user?.id) }}>
      {children}
    </HubCtx.Provider>
  )
}

export const useHub = () => useContext(HubCtx)
