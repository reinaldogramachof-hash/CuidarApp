import { useState, useEffect } from 'react'
import { C, T } from '../../utils/tokens'
import { useAddCareEvent } from '../../hooks/queries/useCareEvents'

const CHECKLIST_ITEMS = [
  { id: 'vitals_start',    label: 'Sinais vitais aferidos no início do turno',  required: true },
  { id: 'hygiene',         label: 'Higiene pessoal realizada',                  required: true },
  { id: 'meal',            label: 'Refeição / hidratação oferecida',             required: true },
  { id: 'medications',     label: 'Medicações do turno verificadas',            required: false },
  { id: 'repositioning',   label: 'Mudança de decúbito realizada (a cada 2h)', required: true },
  { id: 'elimination',     label: 'Eliminações verificadas e registradas',      required: true },
  { id: 'vitals_end',      label: 'Sinais vitais aferidos ao final do turno',   required: true },
  { id: 'family_notified', label: 'Familiar / responsável informado',           required: false },
]

interface ChecklistState {
  [key: string]: { checked: boolean; at: string | null }
}

interface ShiftChecklistProps {
  shiftId: string
  patientId?: string
  caregiverId?: string
  readOnly?: boolean
  initialData?: ChecklistState
  onProgress?: (done: number, total: number, requiredDone: boolean) => void
}

export default function ShiftChecklist({ shiftId, patientId, caregiverId, readOnly, initialData, onProgress }: ShiftChecklistProps) {
  const storageKey = `checklist_${shiftId}`
  const addEventMutation = useAddCareEvent()
  
  const [checked, setChecked] = useState<ChecklistState>(() => {
    if (initialData) return initialData
    try {
      const saved = localStorage.getItem(storageKey)
      if (!saved) return {}
      const parsed = JSON.parse(saved)
      // Migração de formato antigo (boolean) para novo (object)
      const migrated: ChecklistState = {}
      Object.entries(parsed).forEach(([k, v]) => {
        if (typeof v === 'boolean') migrated[k] = { checked: v, at: v ? new Date().toISOString() : null }
        else migrated[k] = v as any
      })
      return migrated
    } catch {
      return {}
    }
  })

  // Sincroniza com initialData se mudar (importante para o familiar)
  useEffect(() => {
    if (initialData) setChecked(initialData)
  }, [JSON.stringify(initialData)])
  
  const [expanded, setExpanded] = useState(!readOnly)

  const toggle = async (id: string) => {
    if (readOnly) return
    const isNowChecked = !checked[id]?.checked
    const next: ChecklistState = { 
      ...checked, 
      [id]: { checked: isNowChecked, at: isNowChecked ? new Date().toISOString() : null } 
    }
    setChecked(next)
    localStorage.setItem(storageKey, JSON.stringify(next))

    // Persiste no banco como um evento oculto para replicação
    if (patientId && caregiverId) {
      try {
        await addEventMutation.mutateAsync({
          shift_id: shiftId,
          patient_id: patientId,
          caregiver_id: caregiverId,
          event_type: 'other',
          notes: `[CHECKLIST] ${JSON.stringify(next)}`
        })
      } catch (e) {
        console.error('Falha ao sincronizar checklist:', e)
      }
    }
  }

  const totalItems    = CHECKLIST_ITEMS.length
  const totalDone     = CHECKLIST_ITEMS.filter(i => checked[i.id]?.checked).length
  const requiredTotal = CHECKLIST_ITEMS.filter(i => i.required).length
  const requiredDone  = CHECKLIST_ITEMS.filter(i => i.required && checked[i.id]?.checked).length
  const allRequired   = requiredDone === requiredTotal
  const progress      = (totalDone / totalItems) * 100

  useEffect(() => {
    onProgress?.(totalDone, totalItems, allRequired)
  }, [checked])

  return (
    <div style={{
      ...styles.card,
      background: expanded ? '#fff' : (allRequired ? C.primaryLight : '#fff'),
      borderColor: allRequired ? C.primary : C.border,
    }}>
      {/* Header */}
      <div 
        onClick={() => setExpanded(!expanded)}
        style={{
          ...styles.header,
          background: allRequired ? C.primaryLight : 'transparent'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
          <i className="fa-solid fa-clipboard-check" style={{ 
            fontSize: '18px', 
            color: allRequired ? C.primary : C.secondary 
          }}></i>
          <span style={styles.title}>Protocolo do Turno</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            ...styles.badge,
            background: allRequired ? C.primary : C.border,
            color: '#fff'
          }}>
            {totalDone}/{totalItems}
          </span>
          <i className={`fa-solid fa-chevron-down`} style={{
            fontSize: '14px',
            color: C.textLight,
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s'
          }}></i>
        </div>
      </div>

      {/* Body */}
      {expanded && (
        <div style={styles.body}>
          {/* Progress Bar */}
          <div style={styles.progressContainer}>
            <div style={{
              ...styles.progressBar,
              width: `${progress}%`,
              background: C.primary
            }} />
          </div>

          {/* List */}
          <div style={styles.list}>
            {CHECKLIST_ITEMS.map(item => {
              const itemState = checked[item.id]
              const isChecked = !!itemState?.checked
              const timeStr = itemState?.at ? new Date(itemState.at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : null

              return (
                <div 
                  key={item.id} 
                  onClick={() => toggle(item.id)}
                  style={styles.itemRow}
                >
                  <i className={`fa-solid ${isChecked ? 'fa-circle-check' : 'fa-circle'}`} style={{
                    fontSize: '18px',
                    color: isChecked ? C.primary : C.border,
                    marginTop: '2px'
                  }}></i>
                  
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{
                        ...styles.itemLabel,
                        color: isChecked ? C.primary : C.navy,
                        textDecoration: isChecked ? 'line-through' : 'none',
                        opacity: isChecked ? 0.7 : 1
                      }}>
                        {item.label}
                      </span>
                      {isChecked && timeStr && (
                        <span style={{ fontSize: '10px', color: C.textLight, fontWeight: 600 }}>{timeStr}</span>
                      )}
                    </div>
                  </div>

                  {item.required && !isChecked && (
                    <span style={styles.requiredBadge}>obrig.</span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  card: {
    borderRadius: '16px',
    border: '1px solid',
    overflow: 'hidden' as const,
    marginBottom: '20px',
    transition: 'all 0.3s ease',
  },
  header: {
    padding: '14px 16px',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    userSelect: 'none' as const,
  },
  title: {
    fontFamily: T.display,
    fontWeight: 700,
    fontSize: '15px',
    color: C.navy,
  },
  badge: {
    padding: '2px 8px',
    borderRadius: '9999px',
    fontSize: '11px',
    fontWeight: 700,
    minWidth: '34px',
    textAlign: 'center' as const,
  },
  body: {
    padding: '0 16px 16px 16px',
  },
  progressContainer: {
    height: '4px',
    background: '#f3f4f5',
    borderRadius: '2px',
    marginBottom: '16px',
    overflow: 'hidden' as const,
  },
  progressBar: {
    height: '100%',
    transition: 'width 0.4s ease',
  },
  list: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  itemRow: {
    display: 'flex',
    gap: '12px',
    cursor: 'pointer',
    alignItems: 'flex-start',
  },
  itemLabel: {
    fontFamily: T.body,
    fontSize: '13px',
    lineHeight: 1.4,
    transition: 'all 0.2s',
  },
  requiredBadge: {
    fontSize: '9px',
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    padding: '2px 6px',
    borderRadius: '4px',
    background: C.dangerLight,
    color: C.danger,
    marginTop: '2px',
  }
}
