# Evitar Repetir Asignaciones en Sorteos

## 📋 Descripción

Esta funcionalidad permite que el algoritmo de sorteo evite asignar la misma pareja (quien regala → quien recibe) que en sorteos anteriores completados por el mismo profesor.

## 🎯 Caso de Uso

Ideal para grupos que realizan múltiples sorteos a lo largo del tiempo (por ejemplo, amigo invisible de Navidad, cumpleaños, fin de curso, etc.) y quieren asegurar variedad en las asignaciones.

## ⚙️ Cómo Funciona

### 1. Activar la Opción

En la vista de sala del profesor, antes de realizar el sorteo, marca la casilla:

```
🔄 Evitar repetir asignaciones anteriores
Nadie le regalará a la misma persona que en sorteos previos de tus salas completadas
```

### 2. Algoritmo

Cuando se activa esta opción, el algoritmo:

1. Busca todas las salas completadas del mismo profesor
2. Obtiene todas las asignaciones previas (quién regaló a quién)
3. Durante el sorteo, valida que ninguna asignación se repita
4. Si no encuentra una combinación válida después de 1000 intentos, muestra un error

### 3. Identificación

Las asignaciones previas se identifican por **email** (no por ID), lo que permite:
- Funciona aunque el participante se una con nombre diferente
- Más confiable entre diferentes salas
- Mantiene historial incluso si se eliminan salas antiguas (mientras existan las asignaciones)

## 🔍 Reglas del Algoritmo

El sorteo debe cumplir TODAS estas reglas simultáneamente:

1. ✅ Nadie se regala a sí mismo
2. ✅ No hay regalos mutuos (A→B y B→A) si hay más de 2 personas
3. ✅ Se respetan las restricciones manuales (configuradas por el profesor)
4. ✅ **NUEVO**: No se repiten asignaciones de sorteos anteriores (si está activado)

## 📊 Consideraciones

### Cuándo NO es Posible

El algoritmo puede fallar si:
- Hay demasiadas restricciones combinadas
- El grupo es muy pequeño y hay muchos sorteos previos
- Las restricciones + historial hacen matemáticamente imposible una asignación válida

**Ejemplo**: Grupo de 3 personas (A, B, C)
- Sorteo 1: A→B, B→C, C→A
- Sorteo 2: A→C, C→B, B→A
- **Sorteo 3**: ❌ Imposible sin repetir (solo hay 2 combinaciones posibles)

### Recomendaciones

- Para grupos pequeños (< 5 personas), desactiva esta opción después de 2-3 sorteos
- Combina con restricciones manuales con cuidado
- Si el sorteo falla, prueba desactivando temporalmente esta opción

## 🗃️ Datos Consultados

La funcionalidad consulta:
- **Tabla**: `rooms` → Salas completadas del profesor
- **Tabla**: `secret_santa_assignments` → Asignaciones previas
- **Tabla**: `room_participants` → Emails de participantes

**Privacidad**: Solo consulta las salas del profesor autenticado actual.

## 🛠️ Migración de Base de Datos

Si ya tienes una base de datos creada, ejecuta:

```sql
ALTER TABLE rooms 
ADD COLUMN IF NOT EXISTS avoid_previous_matches BOOLEAN DEFAULT false;
```

O usa el archivo de migración:
```
supabase/migrations/add_avoid_previous_matches.sql
```

## 🎨 Interfaz de Usuario

La opción aparece como checkbox en la sala del profesor, justo encima del botón "Realizar Sorteo", solo cuando:
- Hay 2 o más participantes
- La sala está en estado "waiting" (no completada)

## 🔄 Estado por Defecto

- **Nuevas salas**: `avoid_previous_matches = false` (desactivado)
- Se puede activar/desactivar en cualquier momento antes del sorteo
- El estado se guarda en la base de datos
