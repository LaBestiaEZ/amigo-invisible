# 🔄 Migración a Sistema con Autenticación

Si ya tenías el sistema anterior sin autenticación y quieres migrar a la nueva versión con cuentas de profesor, sigue estos pasos:

## Opción 1: Empezar de cero (Recomendado)

La forma más sencilla es ejecutar el nuevo script SQL completo:

1. Ve a Supabase SQL Editor
2. Ejecuta el script `supabase-setup.sql` completo
3. Esto creará las nuevas tablas con las políticas de seguridad correctas

**NOTA:** Esto eliminará las tablas antiguas si existen. Si tenías datos importantes, usa la Opción 2.

## Opción 2: Migración de datos existentes

Si ya tienes salas y participantes, ejecuta este script de migración:

```sql
-- 1. Hacer backup de las tablas antiguas
CREATE TABLE rooms_backup AS SELECT * FROM rooms;
CREATE TABLE room_participants_backup AS SELECT * FROM room_participants;

-- 2. Eliminar políticas antiguas
DROP POLICY IF EXISTS "Enable all operations for rooms" ON rooms;
DROP POLICY IF EXISTS "Enable all operations for room_participants" ON room_participants;

-- 3. Agregar columnas nuevas a rooms
ALTER TABLE rooms 
ADD COLUMN IF NOT EXISTS teacher_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS teacher_email TEXT;

-- 4. Crear índice
CREATE INDEX IF NOT EXISTS idx_rooms_teacher ON rooms(teacher_id);

-- 5. Crear nuevas políticas
CREATE POLICY "Teachers can view their own rooms" 
ON rooms FOR SELECT 
USING (auth.uid() = teacher_id);

CREATE POLICY "Teachers can create rooms" 
ON rooms FOR INSERT 
WITH CHECK (auth.uid() = teacher_id);

CREATE POLICY "Teachers can update their own rooms" 
ON rooms FOR UPDATE 
USING (auth.uid() = teacher_id);

CREATE POLICY "Teachers can delete their own rooms" 
ON rooms FOR DELETE 
USING (auth.uid() = teacher_id);

-- 6. Políticas para participantes
DROP POLICY IF EXISTS "Enable all operations for room_participants" ON room_participants;

CREATE POLICY "Anyone can view participants" 
ON room_participants FOR SELECT 
USING (true);

CREATE POLICY "Anyone can join a room" 
ON room_participants FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Only room teacher can delete participants" 
ON room_participants FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM rooms 
    WHERE rooms.id = room_participants.room_id 
    AND rooms.teacher_id = auth.uid()
  )
);
```

## Opción 3: Asignar salas antiguas a un profesor

Si quieres mantener tus salas antiguas y asignarlas a un profesor:

```sql
-- 1. Crea una cuenta de profesor en la app

-- 2. Busca el UUID del usuario (reemplaza el email)
SELECT id FROM auth.users WHERE email = 'profesor@instituto.edu';

-- 3. Asigna todas las salas antiguas a ese profesor
UPDATE rooms 
SET teacher_id = 'UUID-DEL-PROFESOR-AQUI',
    teacher_email = 'profesor@instituto.edu'
WHERE teacher_id IS NULL;
```

## Verificación

Después de la migración, verifica que todo funcione:

1. **Inicia sesión** como profesor
2. **Deberías ver** todas las salas asignadas a tu cuenta
3. **Crea una sala nueva** para probar el flujo completo
4. **Verifica** que los estudiantes puedan unirse

## Diferencias principales

### Antes (sin autenticación):
- Cualquiera podía crear salas sin cuenta
- No había forma de recuperar salas anteriores
- Las salas no estaban protegidas

### Ahora (con autenticación):
- ✅ Los profesores tienen cuenta personal
- ✅ Pueden ver todas sus salas en el dashboard
- ✅ Las salas están protegidas con RLS (Row Level Security)
- ✅ Solo el profesor dueño puede gestionar su sala
- ✅ Historial completo de sorteos

## Solución de problemas

### Error: "relation already exists"
Significa que las tablas ya existen. Usa la Opción 2 (migración) en lugar de crear nuevas tablas.

### No veo mis salas antiguas
Asegúrate de haber ejecutado el script de la Opción 3 para asignar las salas a tu cuenta.

### Error de permisos
Verifica que las políticas RLS estén correctamente configuradas ejecutando:
```sql
SELECT * FROM pg_policies WHERE tablename IN ('rooms', 'room_participants');
```

## Soporte

Si tienes problemas con la migración, puedes:
1. Revisar los logs de Supabase
2. Verificar que las políticas RLS estén activas
3. Comprobar que el email authentication esté habilitado en Supabase
