export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      clinics: {
        Row: {
          id: string
          name: string
          cnpj: string | null
          address: string | null
          phone: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          cnpj?: string | null
          address?: string | null
          phone?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          cnpj?: string | null
          address?: string | null
          phone?: string | null
          created_at?: string | null
        }
      }
      user_profiles: {
        Row: {
          id: string
          clinic_id: string | null
          role: 'admin' | 'caregiver' | 'family' | null
          full_name: string
          phone: string | null
          avatar_url: string | null
          created_at: string | null
        }
        Insert: {
          id: string
          clinic_id?: string | null
          role?: 'admin' | 'caregiver' | 'family' | null
          full_name: string
          phone?: string | null
          avatar_url?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          clinic_id?: string | null
          role?: 'admin' | 'caregiver' | 'family' | null
          full_name?: string
          phone?: string | null
          avatar_url?: string | null
          created_at?: string | null
        }
      }
      patients: {
        Row: {
          id: string
          clinic_id: string
          full_name: string
          date_of_birth: string | null
          cpf: string | null
          photo_url: string | null
          condition: string | null
          room_unit: string | null
          is_active: boolean | null
          deleted_at: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          clinic_id: string
          full_name: string
          date_of_birth?: string | null
          cpf?: string | null
          photo_url?: string | null
          condition?: string | null
          room_unit?: string | null
          is_active?: boolean | null
          deleted_at?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          clinic_id?: string
          full_name?: string
          date_of_birth?: string | null
          cpf?: string | null
          photo_url?: string | null
          condition?: string | null
          room_unit?: string | null
          is_active?: boolean | null
          deleted_at?: string | null
          created_at?: string | null
        }
      }
      patient_family: {
        Row: {
          patient_id: string
          user_id: string
          relation: string | null
        }
        Insert: {
          patient_id: string
          user_id: string
          relation?: string | null
        }
        Update: {
          patient_id?: string
          user_id?: string
          relation?: string | null
        }
      }
      shifts: {
        Row: {
          id: string
          clinic_id: string | null
          caregiver_id: string | null
          patient_id: string | null
          start_time: string
          end_time: string
          checkin_at: string | null
          checkout_at: string | null
          status: 'scheduled' | 'active' | 'completed' | 'missed' | null
          created_at: string | null
        }
        Insert: {
          id?: string
          clinic_id?: string | null
          caregiver_id?: string | null
          patient_id?: string | null
          start_time: string
          end_time: string
          checkin_at?: string | null
          checkout_at?: string | null
          status?: 'scheduled' | 'active' | 'completed' | 'missed' | null
          created_at?: string | null
        }
        Update: {
          id?: string
          clinic_id?: string | null
          caregiver_id?: string | null
          patient_id?: string | null
          start_time?: string
          end_time?: string
          checkin_at?: string | null
          checkout_at?: string | null
          status?: 'scheduled' | 'active' | 'completed' | 'missed' | null
          created_at?: string | null
        }
      }
      care_events: {
        Row: {
          id: string
          shift_id: string | null
          patient_id: string | null
          caregiver_id: string | null
          event_type: 'feeding' | 'hygiene' | 'medication' | 'dressing' | 'repositioning' | 'other' | null
          notes: string | null
          occurred_at: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          shift_id?: string | null
          patient_id?: string | null
          caregiver_id?: string | null
          event_type?: 'feeding' | 'hygiene' | 'medication' | 'dressing' | 'repositioning' | 'other' | null
          notes?: string | null
          occurred_at?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          shift_id?: string | null
          patient_id?: string | null
          caregiver_id?: string | null
          event_type?: 'feeding' | 'hygiene' | 'medication' | 'dressing' | 'repositioning' | 'other' | null
          notes?: string | null
          occurred_at?: string | null
          created_at?: string | null
        }
      }
      vital_signs: {
        Row: {
          id: string
          patient_id: string | null
          caregiver_id: string | null
          shift_id: string | null
          spo2: number | null
          systolic_bp: number | null
          diastolic_bp: number | null
          heart_rate: number | null
          temperature: number | null
          glucose: number | null
          alert_triggered: boolean | null
          measured_at: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          patient_id?: string | null
          caregiver_id?: string | null
          shift_id?: string | null
          spo2?: number | null
          systolic_bp?: number | null
          diastolic_bp?: number | null
          heart_rate?: number | null
          temperature?: number | null
          glucose?: number | null
          alert_triggered?: boolean | null
          measured_at?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          patient_id?: string | null
          caregiver_id?: string | null
          shift_id?: string | null
          spo2?: number | null
          systolic_bp?: number | null
          diastolic_bp?: number | null
          heart_rate?: number | null
          temperature?: number | null
          glucose?: number | null
          alert_triggered?: boolean | null
          measured_at?: string | null
          created_at?: string | null
        }
      }
      alerts: {
        Row: {
          id: string
          patient_id: string | null
          clinic_id: string | null
          vital_sign_id: string | null
          severity: 'low' | 'medium' | 'high' | 'critical' | null
          type: string | null
          message: string
          is_read: boolean | null
          created_at: string | null
        }
        Insert: {
          id?: string
          patient_id?: string | null
          clinic_id?: string | null
          vital_sign_id?: string | null
          severity?: 'low' | 'medium' | 'high' | 'critical' | null
          type?: string | null
          message: string
          is_read?: boolean | null
          created_at?: string | null
        }
        Update: {
          id?: string
          patient_id?: string | null
          clinic_id?: string | null
          vital_sign_id?: string | null
          severity?: 'low' | 'medium' | 'high' | 'critical' | null
          type?: string | null
          message?: string
          is_read?: boolean | null
          created_at?: string | null
        }
      }
      audit_log: {
        Row: {
          id: string
          user_id: string | null
          action: string
          table_name: string | null
          record_id: string | null
          metadata: Json | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          action: string
          table_name?: string | null
          record_id?: string | null
          metadata?: Json | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          action?: string
          table_name?: string | null
          record_id?: string | null
          metadata?: Json | null
          created_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
