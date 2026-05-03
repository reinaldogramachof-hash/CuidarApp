import { Routes, Route, Navigate } from 'react-router-dom'
import FamilyHomePage from './FamilyHomePage'
import VitalHistoryPage from './VitalHistoryPage'

export default function FamilyShell() {
  return (
    <Routes>
      <Route index element={<FamilyHomePage />} />
      <Route path="vitals" element={<VitalHistoryPage />} />
      <Route path="*" element={<Navigate to="" replace />} />
    </Routes>
  )
}
