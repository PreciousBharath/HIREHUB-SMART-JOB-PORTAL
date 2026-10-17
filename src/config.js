import { Briefcase, LayoutDashboard, Search, Bookmark, KanbanSquare, Building2, PlusCircle, Users, FileUser, Target, ShieldCheck, Zap } from 'lucide-react'

export const APP = {
  key: 'hirehub',
  name: 'HireHub',
  logo: Briefcase,
  defaultTheme: 'light',
  defaultAccent: 5,
  demo: { name: 'Aarav Sharma', email: 'demo@hirehub.app', password: 'Demo@1234', role: 'candidate' },
  roles: [{ id: 'candidate', label: '🎓 Job seeker' }, { id: 'employer', label: '🏢 Employer' }],
  hero: {
    title: 'Where great talent meets great teams.',
    subtitle: 'Search hundreds of roles with smart skill-matching, track every application on a visual pipeline, or post jobs and manage applicants as an employer.',
    features: [
      { icon: Target, text: 'Skill-match score on every job' },
      { icon: KanbanSquare, text: 'Visual application pipeline' },
      { icon: Users, text: 'Employer dashboard & applicant tracking' },
      { icon: ShieldCheck, text: 'Secure accounts with hashed passwords' },
    ],
  },
  nav: [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/jobs', label: 'Find Jobs', icon: Search },
    { to: '/saved', label: 'Saved Jobs', icon: Bookmark },
    { to: '/applications', label: 'Applications', icon: KanbanSquare },
    { to: '/resume', label: 'Skills & Resume', icon: FileUser },
    { to: '/companies', label: 'Companies', icon: Building2 },
    { to: '/post', label: 'Post a Job', icon: PlusCircle },
    { to: '/manage', label: 'Manage Hiring', icon: Users },
  ],
  notifications: ['3 new jobs match your skills today', 'Switch between job-seeker and employer views from the dashboard', 'Complete your resume to boost match scores'],
}
export { Zap }
