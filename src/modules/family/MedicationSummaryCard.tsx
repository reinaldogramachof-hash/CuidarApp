import { usePrescriptions, useShiftMedications } from '../../hooks/queries/useMedications'
import { C } from '../../utils/tokens'

interface MedicationSummaryCardProps {
  shiftId: string
  patientId: string
}

export default function MedicationSummaryCard({ shiftId, patientId }: MedicationSummaryCardProps) {
  const { data: prescriptions } = usePrescriptions(patientId)
  const { data: shiftMeds } = useShiftMedications(shiftId)

  const total = prescriptions?.length ?? 0
  const done = shiftMeds?.length ?? 0
  
  if (total === 0) return null

  const progress = total > 0 ? (done / total) * 100 : 0
  const allDone = done >= total && total > 0

  return (
    <div style={{
      background: '#fff', borderRadius: '16px', border: `1px solid ${C.border}`,
      padding: '16px', marginBottom: '20px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <i className="fa-solid fa-pills" style={{ color: C.primary, fontSize: '16px' }}></i>
          <span style={{ fontWeight: 700, fontSize: '14px', color: C.navy }}>Medicações</span>
          {allDone && <i className="fa-solid fa-circle-check" style={{ color: '#047857', fontSize: '14px' }}></i>}
        </div>
        <div style={{ fontSize: '13px', fontWeight: 600, color: C.textMid }}>
          {allDone ? 'Tudo administrado ✓' : `${done} de ${total} dadas`}
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ 
        height: '4px', background: C.borderSubtle, borderRadius: '2px', 
        overflow: 'hidden', display: 'flex', alignItems: 'center', gap: '10px'
      }}>
        <div style={{ 
          height: '100%', width: `${progress}%`, background: C.primary, 
          borderRadius: '2px', transition: 'width 0.5s ease' 
        }} />
      </div>
      <div style={{ marginTop: '6px', textAlign: 'right', fontSize: '11px', fontWeight: 800, color: C.textLight }}>
        {Math.round(progress)}%
      </div>
    </div>
  )
}
