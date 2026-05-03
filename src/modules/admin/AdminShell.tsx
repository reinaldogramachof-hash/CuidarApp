import { Routes, Route, Navigate } from 'react-router-dom'
import AdminDashboard from './AdminDashboard.tsx'
import PatientsPage from './PatientsPage.tsx'
import ShiftsPage from './ShiftsPage.tsx'
import AlertsPage from './AlertsPage.tsx'
import AdminLayout from './AdminLayout.tsx'

export default function AdminShell() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="patients" element={<PatientsPage />} />
        <Route path="shifts" element={<ShiftsPage />} />
        <Route path="alerts" element={<AlertsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="" replace />} />
    </Routes>
  )
}

