-- =============================================================================
-- Helper functions (SECURITY DEFINER) — quebram a recursão infinita do RLS
-- Estas funções ignoram RLS quando chamadas, permitindo subqueries seguras
-- em policies que referenciam a própria tabela user_profiles.
-- =============================================================================

CREATE OR REPLACE FUNCTION public.auth_user_clinic_id()
RETURNS uuid
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT clinic_id FROM public.user_profiles WHERE id = auth.uid()
$$;

CREATE OR REPLACE FUNCTION public.auth_user_role()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT role FROM public.user_profiles WHERE id = auth.uid()
$$;

-- =============================================================================
-- POLICIES: user_profiles
-- =============================================================================

-- Usuário lê e atualiza o próprio perfil
DROP POLICY IF EXISTS "user_select_own_profile" ON user_profiles;
CREATE POLICY "user_select_own_profile" ON user_profiles FOR SELECT TO authenticated
  USING (id = auth.uid());

DROP POLICY IF EXISTS "user_insert_own_profile" ON user_profiles;
CREATE POLICY "user_insert_own_profile" ON user_profiles FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS "user_update_own_profile" ON user_profiles;
CREATE POLICY "user_update_own_profile" ON user_profiles FOR UPDATE TO authenticated
  USING (id = auth.uid()) WITH CHECK (id = auth.uid());

-- Admin vê todos os perfis da sua clínica (usa função DEFINER para evitar recursão)
DROP POLICY IF EXISTS "admin_select_clinic_profiles" ON user_profiles;
CREATE POLICY "admin_select_clinic_profiles" ON user_profiles FOR SELECT TO authenticated
  USING (
    clinic_id = public.auth_user_clinic_id()
    AND public.auth_user_role() = 'admin'
  );

-- =============================================================================
-- POLICIES: patients
-- =============================================================================

DROP POLICY IF EXISTS "admin_select_patients" ON patients;
CREATE POLICY "admin_select_patients" ON patients FOR SELECT TO authenticated
  USING (
    clinic_id = public.auth_user_clinic_id()
    AND public.auth_user_role() = 'admin'
  );

DROP POLICY IF EXISTS "admin_insert_patients" ON patients;
CREATE POLICY "admin_insert_patients" ON patients FOR INSERT TO authenticated
  WITH CHECK (
    clinic_id = public.auth_user_clinic_id()
    AND public.auth_user_role() = 'admin'
  );

DROP POLICY IF EXISTS "admin_update_patients" ON patients;
CREATE POLICY "admin_update_patients" ON patients FOR UPDATE TO authenticated
  USING (
    clinic_id = public.auth_user_clinic_id()
    AND public.auth_user_role() = 'admin'
  );

DROP POLICY IF EXISTS "family_select_patient" ON patients;
CREATE POLICY "family_select_patient" ON patients FOR SELECT TO authenticated
  USING (id IN (
    SELECT patient_id FROM patient_family WHERE user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "caregiver_select_patients" ON patients;
CREATE POLICY "caregiver_select_patients" ON patients FOR SELECT TO authenticated
  USING (id IN (
    SELECT patient_id FROM shifts
    WHERE caregiver_id = auth.uid() AND status IN ('scheduled', 'active')
  ));

-- =============================================================================
-- POLICIES: patient_family
-- =============================================================================

DROP POLICY IF EXISTS "admin_manage_patient_family" ON patient_family;
CREATE POLICY "admin_manage_patient_family" ON patient_family FOR ALL TO authenticated
  USING (public.auth_user_role() = 'admin')
  WITH CHECK (public.auth_user_role() = 'admin');

DROP POLICY IF EXISTS "family_select_own_links" ON patient_family;
CREATE POLICY "family_select_own_links" ON patient_family FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- =============================================================================
-- POLICIES: shifts
-- =============================================================================

DROP POLICY IF EXISTS "caregiver_select_own_shifts" ON shifts;
CREATE POLICY "caregiver_select_own_shifts" ON shifts FOR SELECT TO authenticated
  USING (caregiver_id = auth.uid());

DROP POLICY IF EXISTS "caregiver_update_own_shifts" ON shifts;
CREATE POLICY "caregiver_update_own_shifts" ON shifts FOR UPDATE TO authenticated
  USING (caregiver_id = auth.uid())
  WITH CHECK (caregiver_id = auth.uid());

DROP POLICY IF EXISTS "admin_manage_shifts" ON shifts;
CREATE POLICY "admin_manage_shifts" ON shifts FOR ALL TO authenticated
  USING (
    clinic_id = public.auth_user_clinic_id()
    AND public.auth_user_role() = 'admin'
  )
  WITH CHECK (
    clinic_id = public.auth_user_clinic_id()
    AND public.auth_user_role() = 'admin'
  );

-- =============================================================================
-- POLICIES: care_events
-- =============================================================================

DROP POLICY IF EXISTS "caregiver_manage_own_events" ON care_events;
CREATE POLICY "caregiver_manage_own_events" ON care_events FOR ALL TO authenticated
  USING (caregiver_id = auth.uid())
  WITH CHECK (caregiver_id = auth.uid());

DROP POLICY IF EXISTS "admin_select_clinic_events" ON care_events;
CREATE POLICY "admin_select_clinic_events" ON care_events FOR SELECT TO authenticated
  USING (patient_id IN (
    SELECT id FROM patients WHERE clinic_id = public.auth_user_clinic_id()
  ));

-- =============================================================================
-- POLICIES: vital_signs
-- =============================================================================

DROP POLICY IF EXISTS "caregiver_insert_vitals" ON vital_signs;
CREATE POLICY "caregiver_insert_vitals" ON vital_signs FOR INSERT TO authenticated
  WITH CHECK (
    caregiver_id = auth.uid()
    AND patient_id IN (
      SELECT patient_id FROM shifts
      WHERE caregiver_id = auth.uid() AND status = 'active'
    )
  );

DROP POLICY IF EXISTS "caregiver_select_own_vitals" ON vital_signs;
CREATE POLICY "caregiver_select_own_vitals" ON vital_signs FOR SELECT TO authenticated
  USING (caregiver_id = auth.uid());

DROP POLICY IF EXISTS "family_select_vitals" ON vital_signs;
CREATE POLICY "family_select_vitals" ON vital_signs FOR SELECT TO authenticated
  USING (patient_id IN (
    SELECT patient_id FROM patient_family WHERE user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "admin_select_vitals" ON vital_signs;
CREATE POLICY "admin_select_vitals" ON vital_signs FOR SELECT TO authenticated
  USING (patient_id IN (
    SELECT id FROM patients WHERE clinic_id = public.auth_user_clinic_id()
  ));

-- =============================================================================
-- POLICIES: alerts
-- =============================================================================

DROP POLICY IF EXISTS "admin_manage_clinic_alerts" ON alerts;
CREATE POLICY "admin_manage_clinic_alerts" ON alerts FOR ALL TO authenticated
  USING (
    clinic_id = public.auth_user_clinic_id()
    AND public.auth_user_role() = 'admin'
  )
  WITH CHECK (
    clinic_id = public.auth_user_clinic_id()
    AND public.auth_user_role() = 'admin'
  );

DROP POLICY IF EXISTS "family_select_patient_alerts" ON alerts;
CREATE POLICY "family_select_patient_alerts" ON alerts FOR SELECT TO authenticated
  USING (patient_id IN (
    SELECT patient_id FROM patient_family WHERE user_id = auth.uid()
  ));

-- =============================================================================
-- POLICIES: audit_log (somente leitura pelo admin da clínica)
-- =============================================================================

DROP POLICY IF EXISTS "admin_select_clinic_audit" ON audit_log;
CREATE POLICY "admin_select_clinic_audit" ON audit_log FOR SELECT TO authenticated
  USING (
    public.auth_user_role() = 'admin'
    AND user_id IN (
      SELECT id FROM user_profiles WHERE clinic_id = public.auth_user_clinic_id()
    )
  );
