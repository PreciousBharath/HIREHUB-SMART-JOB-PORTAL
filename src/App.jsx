import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import { Protected, GuestOnly } from './guard.jsx'
import { HubProvider } from './hub.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Jobs from './pages/Jobs.jsx'
import Applications from './pages/Applications.jsx'
import Resume from './pages/Resume.jsx'
import Companies from './pages/Companies.jsx'
import PostJob from './pages/PostJob.jsx'
import Manage from './pages/Manage.jsx'
import Profile from './pages/Profile.jsx'
import Settings from './pages/Settings.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<GuestOnly><Login /></GuestOnly>} />
      <Route path="/register" element={<GuestOnly><Register /></GuestOnly>} />
      <Route element={<Protected><HubProvider><Layout /></HubProvider></Protected>}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/saved" element={<Jobs savedOnly />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/resume" element={<Resume />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/post" element={<PostJob />} />
        <Route path="/manage" element={<Manage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
