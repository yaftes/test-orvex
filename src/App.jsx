import { Route, Routes } from 'react-router-dom'
import { AppProviders } from './context/AppContext'
import AppShell from './layouts/AppShell'
import DemoStateSwitcher from './components/DemoStateSwitcher'

import Landing from './pages/Landing'
import { SignIn, SignUp, ChooseOrg } from './pages/Auth'
import Dashboard from './pages/Dashboard'
import Marketplace from './pages/Marketplace'
import SkillDetail from './pages/SkillDetail'
import Builder from './pages/Builder'
import UseIt from './pages/UseIt'
import ExportPage from './pages/ExportPage'
import Drafts from './pages/Drafts'
import DraftManage from './pages/DraftManage'
import Published from './pages/Published'
import VersionSnapshot from './pages/VersionSnapshot'
import ReviewInbox from './pages/ReviewInbox'
import MemoryOnboarding from './pages/MemoryOnboarding'
import MemoryHome from './pages/MemoryHome'
import Librarian from './pages/Librarian'
import Wiki from './pages/Wiki'
import ActivityFeed from './pages/ActivityFeed'
import Following from './pages/Following'
import { Collections, SharedCollection } from './pages/Collections'
import AuthorProfile from './pages/AuthorProfile'
import SharePage from './pages/SharePage'
import SettingsPage from './pages/SettingsPage'
import Admin from './pages/Admin'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <AppProviders>
      <Routes>
        {/* Public / logged-out */}
        <Route path="/" element={<Landing />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/choose-org" element={<ChooseOrg />} />
        <Route path="/s/:id" element={<SharePage />} />
        <Route path="/c/:shareId" element={<SharedCollection />} />

        {/* Signed-in app */}
        <Route path="/app" element={<AppShell />}>
          <Route index element={<Dashboard />} />
          <Route path="marketplace" element={<Marketplace />} />
          <Route path="skills/:id" element={<SkillDetail />} />
          <Route path="skills/:id/use" element={<UseIt />} />
          <Route path="skills/:id/export" element={<ExportPage />} />
          <Route path="builder/:id" element={<Builder />} />
          <Route path="drafts" element={<Drafts />} />
          <Route path="drafts/:id" element={<DraftManage />} />
          <Route path="published" element={<Published />} />
          <Route path="published/:id/v/:version" element={<VersionSnapshot />} />
          <Route path="review" element={<ReviewInbox />} />
          <Route path="memory/onboarding" element={<MemoryOnboarding />} />
          <Route path="memory" element={<MemoryHome />} />
          <Route path="librarian" element={<Librarian />} />
          <Route path="wiki" element={<Wiki />} />
          <Route path="activity" element={<ActivityFeed />} />
          <Route path="following" element={<Following />} />
          <Route path="collections" element={<Collections />} />
          <Route path="authors/:handle" element={<AuthorProfile />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="admin" element={<Admin />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
      <DemoStateSwitcher />
    </AppProviders>
  )
}
