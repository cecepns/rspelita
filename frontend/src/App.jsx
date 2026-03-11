import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from './layouts/MainLayout.jsx'
import AdminLayout from './layouts/AdminLayout.jsx'
import HomePage from './pages/HomePage.jsx'
import AboutPage from './pages/AboutPage.jsx'
import ServicesPage from './pages/ServicesPage.jsx'
import NewsPage from './pages/NewsPage.jsx'
import ContactPage from './pages/ContactPage.jsx'
import AdminLoginPage from './pages/admin/AdminLoginPage.jsx'
import DashboardHomePage from './pages/admin/DashboardHomePage.jsx'
import FacilitiesPage from './pages/admin/FacilitiesPage.jsx'
import DoctorsPage from './pages/admin/DoctorsPage.jsx'
import ArticlesPage from './pages/admin/ArticlesPage.jsx'
import ContentSettingsPage from './pages/admin/ContentSettingsPage.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/tentang-kami" element={<AboutPage />} />
          <Route path="/layanan" element={<ServicesPage />} />
          <Route path="/berita" element={<NewsPage />} />
          <Route path="/kontak-kami" element={<ContactPage />} />
        </Route>

        <Route path="/admin/login" element={<AdminLoginPage />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardHomePage />} />
          <Route path="fasilitas" element={<FacilitiesPage />} />
          <Route path="dokter" element={<DoctorsPage />} />
          <Route path="berita" element={<ArticlesPage />} />
          <Route path="konten" element={<ContentSettingsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
