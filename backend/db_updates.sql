-- Actualizaciones Fase 1 Admin
INSERT INTO academic_periods (name, start_date, end_date, is_active) VALUES ('2025-2026', '2025-01-01', '2026-01-01', TRUE);
ALTER TABLE students DISABLE ROW LEVEL SECURITY;
ALTER TABLE scholarship_applications DISABLE ROW LEVEL SECURITY;
TRUNCATE TABLE scholarship_applications CASCADE;
ALTER TABLE scholarship_applications ADD CONSTRAINT unique_application_per_period UNIQUE (student_id, period_id);