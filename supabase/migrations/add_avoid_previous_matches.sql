-- Migración: Añadir campo para evitar repetir asignaciones
-- Fecha: 2025-11-17

-- Añadir columna avoid_previous_matches a la tabla rooms
ALTER TABLE rooms 
ADD COLUMN IF NOT EXISTS avoid_previous_matches BOOLEAN DEFAULT false;

-- Comentario
COMMENT ON COLUMN rooms.avoid_previous_matches IS 'Cuando está activo, el algoritmo evitará asignar la misma pareja que en sorteos anteriores del mismo profesor';
