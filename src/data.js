export const COMPANIES = [
  { id: 'c1', name: 'NovaByte Labs', logo: '🚀', industry: 'AI & Cloud', size: '500-1000', rating: 4.5, city: 'Bengaluru', color: '#6366f1', about: 'Builds AI-first cloud tooling for enterprises.' },
  { id: 'c2', name: 'GreenGrid Energy', logo: '🌿', industry: 'Clean Energy', size: '1000+', rating: 4.2, city: 'Chennai', color: '#10b981', about: 'Smart-grid and renewable energy analytics.' },
  { id: 'c3', name: 'PixelCraft Studio', logo: '🎨', industry: 'Design & Media', size: '50-200', rating: 4.7, city: 'Remote', color: '#ec4899', about: 'Product design studio for fast-growing startups.' },
  { id: 'c4', name: 'FinEdge Capital', logo: '💹', industry: 'Fintech', size: '200-500', rating: 4.0, city: 'Mumbai', color: '#f59e0b', about: 'Digital lending and payments platform.' },
  { id: 'c5', name: 'MediCore Health', logo: '🩺', industry: 'Healthtech', size: '200-500', rating: 4.3, city: 'Hyderabad', color: '#ef4444', about: 'Connected-care software for hospitals.' },
  { id: 'c6', name: 'ShopSwift', logo: '🛒', industry: 'E-commerce', size: '1000+', rating: 3.9, city: 'Gurugram', color: '#f97316', about: 'Quick-commerce delivering in 15 minutes.' },
  { id: 'c7', name: 'CipherWall Security', logo: '🛡️', industry: 'Cybersecurity', size: '50-200', rating: 4.6, city: 'Pune', color: '#0ea5e9', about: 'Zero-trust security for modern teams.' },
  { id: 'c8', name: 'EduSpark', logo: '📚', industry: 'Edtech', size: '200-500', rating: 4.1, city: 'Madurai', color: '#8b5cf6', about: 'Personalised learning for millions of students.' },
]

const ROLES = [
  ['Frontend Developer (React)', ['React', 'JavaScript', 'CSS', 'TypeScript'], 'Engineering'],
  ['Machine Learning Engineer', ['Python', 'TensorFlow', 'scikit-learn', 'SQL'], 'Data & AI'],
  ['Full Stack Developer', ['React', 'Node.js', 'MongoDB', 'Express'], 'Engineering'],
  ['Data Analyst', ['SQL', 'Power BI', 'Excel', 'Python'], 'Data & AI'],
  ['UI/UX Designer', ['Figma', 'Prototyping', 'User Research', 'CSS'], 'Design'],
  ['DevOps Engineer', ['AWS', 'Docker', 'Kubernetes', 'CI/CD'], 'Engineering'],
  ['Python Backend Developer', ['Python', 'Django', 'PostgreSQL', 'REST'], 'Engineering'],
  ['GenAI Engineer', ['Python', 'LLMs', 'LangChain', 'Prompt Engineering'], 'Data & AI'],
  ['Cybersecurity Analyst', ['Networking', 'SIEM', 'Linux', 'Python'], 'Security'],
  ['Digital Marketing Executive', ['SEO', 'Google Ads', 'Content', 'Analytics'], 'Marketing'],
  ['Business Development Manager', ['Sales', 'Negotiation', 'CRM', 'Communication'], 'Sales'],
  ['Mobile Developer (Flutter)', ['Flutter', 'Dart', 'Firebase', 'REST'], 'Engineering'],
  ['Cloud Solutions Architect', ['AWS', 'Azure', 'Terraform', 'Networking'], 'Engineering'],
  ['Technical Trainer', ['Python', 'Communication', 'Machine Learning', 'Curriculum'], 'Education'],
]
const TYPES = ['Full-time', 'Full-time', 'Full-time', 'Internship', 'Contract', 'Part-time']
const WORK = ['On-site', 'Hybrid', 'Remote']

let s = 20261017
// mulberry32 — small, well-distributed seeded PRNG so the catalogue is identical on every load
const r = () => { s |= 0; s = (s + 0x6d2b79f5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296 }

export const SEED_JOBS = Array.from({ length: 32 }, (_, i) => {
  const [title, skills, dept] = ROLES[i % ROLES.length]
  const c = COMPANIES[Math.floor(r() * COMPANIES.length)]
  const exp = Math.floor(r() * 7)
  const min = 3 + exp * 2 + Math.floor(r() * 4)
  const type = TYPES[Math.floor(r() * TYPES.length)]
  return {
    id: `j${i + 1}`, title, skills, dept, companyId: c.id, company: c.name, logo: c.logo, color: c.color,
    location: c.city === 'Remote' ? 'Remote' : c.city, work: c.city === 'Remote' ? 'Remote' : WORK[Math.floor(r() * 3)],
    type, expMin: exp, expMax: exp + 2 + Math.floor(r() * 3),
    salaryMin: type === 'Internship' ? 2 : min, salaryMax: type === 'Internship' ? 4 : min + 4 + Math.floor(r() * 8),
    posted: Date.now() - Math.floor(r() * 20) * 86400000, applicants: Math.floor(r() * 180), openings: 1 + Math.floor(r() * 4),
    description: `${c.name} is hiring a ${title} to join our ${dept} team. You will design, build and ship high-impact features, collaborate with cross-functional teams and mentor peers.`,
    responsibilities: ['Own features end-to-end from design to production', 'Collaborate with product, design and QA', 'Write clean, tested, well-documented work', 'Continuously improve performance and quality'],
    perks: ['Health insurance', 'Flexible hours', 'Learning budget', 'Annual offsite'].slice(0, 2 + Math.floor(r() * 3)),
    status: 'open', postedBy: 'seed',
  }
})

export const STAGES = [
  { id: 'applied', label: 'Applied', color: '#6366f1' },
  { id: 'screening', label: 'Screening', color: '#0ea5e9' },
  { id: 'interview', label: 'Interview', color: '#f59e0b' },
  { id: 'offer', label: 'Offer', color: '#10b981' },
  { id: 'rejected', label: 'Rejected', color: '#ef4444' },
]

/** Skill-match: % of required skills present in the candidate profile (case-insensitive), with an experience bonus. */
export function matchScore(job, profile) {
  const have = new Set((profile?.skills || []).map((x) => x.toLowerCase()))
  if (!have.size) return 0
  const hit = job.skills.filter((x) => have.has(x.toLowerCase())).length
  const expOk = (profile.experience ?? 0) >= job.expMin ? 1 : 0.6
  return Math.round((hit / job.skills.length) * 85 * expOk + (expOk === 1 ? 15 : 5))
}

export const ago = (t) => { const d = Math.floor((Date.now() - t) / 86400000); return d <= 0 ? 'Today' : d === 1 ? 'Yesterday' : `${d} days ago` }
