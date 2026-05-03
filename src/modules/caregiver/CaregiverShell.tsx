import { Routes, Route, Navigate } from 'react-router-dom'
import ShiftsListPage from './ShiftsListPage'
import ActiveShiftPage from './ActiveShiftPage'

export default function CaregiverShell() {
  return (
    <Routes>
      <Route index element={<ShiftsListPage />} />
      <Route path="shift/:shiftId" element={<ActiveShiftPage />} />
      <Route path="*" element={<Navigate to="" replace />} />
    </Routes>
  )
}
