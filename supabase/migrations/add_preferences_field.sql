-- Agregar campo de preferencias/gustos a la tabla de participantes
ALTER TABLE room_participants 
ADD COLUMN preferences TEXT;

-- Agregar comentario explicativo
COMMENT ON COLUMN room_participants.preferences IS 'Preferencias o gustos del participante para el amigo invisible';
