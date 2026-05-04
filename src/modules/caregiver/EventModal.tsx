import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAddCareEvent } from '../../hooks/queries/useCareEvents'
import { C, T } from '../../utils/tokens'

interface EventModalProps {
  event: { type: string; label: string; icon: string; color: string } | null
  shiftId: string
  patientId: string
  caregiverId: string
  onClose: () => void
  onSuccess: () => void
}

export default function EventModal({ event, shiftId, patientId, caregiverId, onClose, onSuccess }: EventModalProps) {
  const addEventMutation = useAddCareEvent()
  const { register, handleSubmit, watch, formState: { errors } } = useForm()

  if (!event) return null

  const onSubmit = async (data: any) => {
    try {
      let notes = ''
      
      switch (event.type) {
        case 'feeding':
          notes = `Via: ${data.via || '?'} | Refeição: ${data.meal || '?'} | Aceitação: ${data.acceptance || '?'}${data.obs ? ` | Obs: ${data.obs}` : ''}`
          break
        case 'hygiene':
          const procedures = Object.entries(data.procedures || {})
            .filter(([_, checked]) => checked)
            .map(([name, _]) => name)
            .join(', ')
          notes = `Procedimentos: ${procedures || 'Nenhum'}${data.obs ? ` | Obs: ${data.obs}` : ''}`
          break
        case 'medication':
          notes = `Medicamento: ${data.medication || '?'} | Via: ${data.via || '?'} | Dose: ${data.dose || '?'}${data.obs ? ` | Obs: ${data.obs}` : ''}`
          break
        case 'repositioning':
          notes = `De: ${data.fromPos || '?'} → Para: ${data.toPos || '?'}${data.obs ? ` | Obs: ${data.obs}` : ''}`
          break
        case 'dressing':
          notes = `Local: ${data.location || '?'} | Aspecto: ${data.aspect || '?'} | Produto: ${data.product || '?'}${data.obs ? ` | Obs: ${data.obs}` : ''}`
          break
        case 'other':
          notes = data.description || ''
          break
      }

      await addEventMutation.mutateAsync({
        shift_id: shiftId,
        patient_id: patientId,
        caregiver_id: caregiverId,
        event_type: event.type,
        notes: notes
      })
      onSuccess()
    } catch (err) {
      console.error('Erro ao salvar evento:', err)
      alert('Erro ao salvar evento. Verifique sua conexão.')
    }
  }

  const renderForm = () => {
    switch (event.type) {
      case 'feeding':
        return (
          <>
            <div style={styles.formGroup}>
              <label style={styles.label}>VIA *</label>
              <select {...register('via', { required: true })} className="input-field" style={errors.via ? styles.errorBorder : {}}>
                <option value="">Selecione...</option>
                <option value="Oral">Oral</option>
                <option value="SNE (Sonda Nasoentérica)">SNE (Sonda Nasoentérica)</option>
                <option value="Gastrostomia">Gastrostomia</option>
                <option value="Parenteral">Parenteral</option>
              </select>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>REFEIÇÃO *</label>
              <select {...register('meal', { required: true })} className="input-field" style={errors.meal ? styles.errorBorder : {}}>
                <option value="">Selecione...</option>
                <option value="Café da manhã">Café da manhã</option>
                <option value="Lanche manhã">Lanche manhã</option>
                <option value="Almoço">Almoço</option>
                <option value="Lanche tarde">Lanche tarde</option>
                <option value="Jantar">Jantar</option>
                <option value="Ceia">Ceia</option>
                <option value="Hidratação">Hidratação</option>
              </select>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>ACEITAÇÃO *</label>
              <select {...register('acceptance', { required: true })} className="input-field" style={errors.acceptance ? styles.errorBorder : {}}>
                <option value="">Selecione...</option>
                <option value="100% — tudo">100% — tudo</option>
                <option value="75% — quase tudo">75% — quase tudo</option>
                <option value="50% — metade">50% — metade</option>
                <option value="25% — pouco">25% — pouco</option>
                <option value="Recusou">Recusou</option>
              </select>
            </div>
          </>
        )
      case 'hygiene':
        const hygieneOptions = ['Banho completo', 'Banho no leito', 'Higiene íntima', 'Higiene oral', 'Troca de fralda', 'Cuidado com unhas']
        return (
          <div style={styles.formGroup}>
            <label style={styles.label}>PROCEDIMENTOS * (Mínimo 1)</label>
            <div style={styles.checkboxList}>
              {hygieneOptions.map(opt => {
                const isChecked = watch(`procedures.${opt}`)
                return (
                  <label key={opt} style={{
                    ...styles.checkboxRow,
                    border: isChecked ? `1.5px solid ${C.primary}` : `1.5px solid ${C.border}`,
                    background: isChecked ? C.primaryLight : '#f3f4f5'
                  }}>
                    <input type="checkbox" {...register(`procedures.${opt}`, {
                      validate: () => {
                        const values = watch('procedures')
                        return Object.values(values || {}).some(v => v) || 'Selecione ao menos um'
                      }
                    })} style={{ display: 'none' }} />
                    <span style={{ color: isChecked ? C.primary : C.navy, fontWeight: isChecked ? 700 : 500, fontSize: '14px' }}>
                      <i className={`fa-regular ${isChecked ? 'fa-square-check' : 'fa-square'}`} style={{ marginRight: '10px' }}></i>
                      {opt}
                    </span>
                  </label>
                )
              })}
            </div>
            {errors.procedures && <span style={{ color: C.danger, fontSize: '12px' }}>Selecione ao menos um procedimento</span>}
          </div>
        )
      case 'medication':
        return (
          <>
            <div style={styles.formGroup}>
              <label style={styles.label}>MEDICAMENTO *</label>
              <input {...register('medication', { required: true })} className="input-field" placeholder="ex: Losartana 50mg" style={errors.medication ? styles.errorBorder : {}} />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>VIA *</label>
              <select {...register('via', { required: true })} className="input-field" style={errors.via ? styles.errorBorder : {}}>
                <option value="">Selecione...</option>
                <option value="Oral">Oral</option>
                <option value="Sublingual">Sublingual</option>
                <option value="Subcutânea">Subcutânea</option>
                <option value="Intramuscular">Intramuscular</option>
                <option value="Tópica">Tópica</option>
                <option value="Inalatória">Inalatória</option>
                <option value="Endovenosa">Endovenosa</option>
              </select>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>DOSE ADMINISTRADA *</label>
              <input {...register('dose', { required: true })} className="input-field" placeholder="ex: 1 comprimido" style={errors.dose ? styles.errorBorder : {}} />
            </div>
          </>
        )
      case 'repositioning':
        const positions = ["Supino", "Lateral Direito", "Lateral Esquerdo", "Semifowler (30°)", "Fowler (45°)", "Pronado"]
        return (
          <>
            <div style={styles.formGroup}>
              <label style={styles.label}>POSIÇÃO ANTERIOR *</label>
              <select {...register('fromPos', { required: true })} className="input-field" style={errors.fromPos ? styles.errorBorder : {}}>
                <option value="">Selecione...</option>
                {positions.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>POSIÇÃO ATUAL *</label>
              <select {...register('toPos', { required: true })} className="input-field" style={errors.toPos ? styles.errorBorder : {}}>
                <option value="">Selecione...</option>
                {positions.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </>
        )
      case 'dressing':
        return (
          <>
            <div style={styles.formGroup}>
              <label style={styles.label}>LOCALIZAÇÃO *</label>
              <input {...register('location', { required: true })} className="input-field" placeholder="ex: Calcanhar direito" style={errors.location ? styles.errorBorder : {}} />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>ASPECTO DA FERIDA *</label>
              <select {...register('aspect', { required: true })} className="input-field" style={errors.aspect ? styles.errorBorder : {}}>
                <option value="">Selecione...</option>
                <option value="Limpo e seco">Limpo e seco</option>
                <option value="Serosanguinolento">Serosanguinolento</option>
                <option value="Sanguinolento">Sanguinolento</option>
                <option value="Purulento">Purulento</option>
                <option value="Em granulação">Em granulação</option>
                <option value="Necrótico">Necrótico</option>
              </select>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>PRODUTO UTILIZADO</label>
              <input {...register('product')} className="input-field" placeholder="ex: SF 0,9% + Colagenase" />
            </div>
          </>
        )
      case 'other':
        return (
          <div style={styles.formGroup}>
            <label style={styles.label}>DESCRIÇÃO *</label>
            <textarea {...register('description', { required: true, minLength: 10 })} 
              className="input-field" 
              style={{ minHeight: '120px', resize: 'none', ...(errors.description ? styles.errorBorder : {}) }} 
              placeholder="Descreva o evento detalhadamente..."
            />
            {errors.description && <span style={{ color: C.danger, fontSize: '12px' }}>Mínimo 10 caracteres</span>}
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.sheet}>
        <div style={styles.header}>
          <div style={{ ...styles.iconBg, background: event.color }}>
            <i className={`fa-solid ${event.icon}`}></i>
          </div>
          <h2 style={styles.title}>{event.label}</h2>
          <button onClick={onClose} style={styles.closeBtn}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} style={styles.body}>
          {renderForm()}
          
          {event.type !== 'other' && (
            <div style={styles.formGroup}>
              <label style={styles.label}>OBSERVAÇÕES ADICIONAIS</label>
              <textarea {...register('obs')} className="input-field" style={{ minHeight: '80px', resize: 'none' }} placeholder="Opcional..." />
            </div>
          )}

          <div style={styles.footer}>
            <button type="button" onClick={onClose} className="btn-outline" style={{ flex: 1 }}>Cancelar</button>
            <button type="submit" disabled={addEventMutation.isPending} className="btn-primary" style={{ flex: 1 }}>
              {addEventMutation.isPending ? <i className="fa-solid fa-circle-notch fa-spin"></i> : 'Confirmar Registro'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const styles = {
  overlay: {
    position: 'fixed' as const,
    inset: 0,
    background: 'rgba(25,28,29,0.5)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    zIndex: 1000,
  },
  sheet: {
    width: '100%',
    maxWidth: '520px',
    background: '#fff',
    borderTopLeftRadius: '24px',
    borderTopRightRadius: '24px',
    padding: '24px',
    boxShadow: '0 -10px 40px rgba(0,0,0,0.1)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '20px',
  },
  iconBg: {
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: '18px',
  },
  title: {
    fontFamily: T.display,
    fontWeight: 800,
    fontSize: '18px',
    color: C.navy,
    flex: 1,
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '20px',
    color: C.textLight,
    cursor: 'pointer',
    padding: '4px',
  },
  body: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '6px',
  },
  label: {
    fontFamily: T.display,
    fontWeight: 700,
    fontSize: '13px',
    color: C.navy,
    letterSpacing: '0.02em',
  },
  checkboxList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  checkboxRow: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 16px',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  footer: {
    display: 'flex',
    gap: '12px',
    marginTop: '8px',
  },
  errorBorder: {
    borderColor: C.danger,
    boxShadow: '0 0 0 1px rgba(186, 26, 26, 0.2)',
  }
}
