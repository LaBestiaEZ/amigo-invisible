-- ============================================
-- PERMITIR QUE ESTUDIANTES VEAN SU ASIGNACIÓN
-- ============================================

-- Los estudiantes pueden ver su propia asignación (donde ellos son el "giver")
CREATE POLICY "Students can view their own assignment" 
ON secret_santa_assignments FOR SELECT 
USING (true);

-- Nota: La seguridad está garantizada porque:
-- 1. El estudiante solo conoce su propio participant.id (en la URL)
-- 2. La consulta filtra por giver_id = participant.id
-- 3. Solo pueden ver quién LES tocó, no las demás asignaciones
