-- Añadir campo de restricciones a room_participants
-- Este campo almacena un array de IDs de participantes que no pueden tocarle a este participante

ALTER TABLE room_participants 
ADD COLUMN IF NOT EXISTS restrictions TEXT[];

COMMENT ON COLUMN room_participants.restrictions IS 'Array de IDs de participantes que no pueden ser asignados a esta persona';
