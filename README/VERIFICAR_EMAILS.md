# 🔍 Verificar configuración de Resend

## ¿Por qué los emails aparecen como "Pendientes"?

Hay varias razones posibles:

### 1. ⚠️ API Key inválida o expirada

La API key que tienes (`re_ZDM9vf36_4acZfk97y6ynhk42XTmgKzpT`) puede estar:
- ❌ Expirada
- ❌ Revocada
- ❌ No tener permisos de envío

### 2. 🔐 Verificar API Key en Resend

#### Pasos:

1. **Ve a Resend:** [https://resend.com/api-keys](https://resend.com/api-keys)

2. **Busca tu API key** (o crea una nueva):
   - Nombre: `amigo-invisible`
   - Permisos: **Sending access**
   - Click en **"Create API Key"**

3. **Copia la nueva API key** (empieza con `re_...`)

4. **Actualiza `.env`:**
   ```bash
   VITE_RESEND_API_KEY=re_TuNuevaApiKey
   ```

5. **Reinicia el servidor:**
   ```bash
   npm run dev
   ```

---

## ✅ Verificación manual

### Opción 1: Desde la consola del navegador

1. Abre la aplicación: http://localhost:5173
2. Abre la consola (F12)
3. Ejecuta este código:

```javascript
// Verificar que la API key se carga correctamente
console.log('API Key configurada:', !!import.meta.env.VITE_RESEND_API_KEY)
console.log('Primeros 10 chars:', import.meta.env.VITE_RESEND_API_KEY?.substring(0, 10))
```

Debería mostrar:
```
API Key configurada: true
Primeros 10 chars: re_ZDM9vf3
```

### Opción 2: Test de envío directo

Crea una sala de prueba y haz un sorteo con 2 personas usando **emails reales**.

**Qué verificar:**

1. **En la consola del navegador (F12):**
   - Busca mensajes como:
     ```
     ✅ 2 de 2 emails enviados exitosamente
     ```
   - Si ves errores, cópialos

2. **En Resend Dashboard:**
   - Ve a [https://resend.com/emails](https://resend.com/emails)
   - Deberías ver los emails enviados
   - Estados posibles:
     - ✅ **Delivered** - Email enviado correctamente
     - ⏳ **Queued** - En cola para enviar
     - ❌ **Failed** - Error al enviar
     - 🔴 **Bounced** - Email inválido

---

## 🐛 Errores comunes y soluciones

### ❌ Error: "Missing API key"

**Problema:** La API key no está configurada

**Solución:**
```bash
# Verifica que esté en .env sin espacios:
VITE_RESEND_API_KEY=re_tu_api_key

# NO debe tener espacios ni comillas
# ❌ MALO: VITE_RESEND_API_KEY = "re_xxx"
# ✅ BUENO: VITE_RESEND_API_KEY=re_xxx
```

### ❌ Error: "Invalid API key" o "Unauthorized"

**Problema:** La API key es inválida

**Solución:**
1. Crea una **nueva API key** en Resend
2. Reemplaza la antigua en `.env`
3. Reinicia el servidor

### ❌ Error: "Email validation failed"

**Problema:** El email del destinatario es inválido

**Solución:**
- Usa emails reales y válidos
- No uses emails temporales
- Verifica que no haya espacios

### ❌ Error: "Rate limit exceeded"

**Problema:** Superaste el límite de 100 emails/día

**Solución:**
- Espera hasta mañana (se resetea a medianoche UTC)
- O actualiza al plan de pago

### ❌ Los emails se envían pero aparecen como "Pendientes" en el modal

**Problema:** El campo `email_sent` no se actualiza en la base de datos

**Solución:** Ya está arreglado en la última versión. Si sigues viéndolo:
1. Borra las asignaciones antiguas de la base de datos
2. Haz un nuevo sorteo

---

## 🔧 Verificar el fix aplicado

El código ahora actualiza correctamente el estado `email_sent` en la base de datos.

**Para verificar que el fix está aplicado:**

1. Abre `src/App.jsx`
2. Busca la función `performDraw`
3. Deberías ver este código (línea ~300):

```javascript
// Actualizar el campo email_sent en las asignaciones
for (let i = 0; i < participants.length; i++) {
  const emailSent = emailResults[i]?.emailSent || false
  
  await supabase
    .from('secret_santa_assignments')
    .update({ email_sent: emailSent })
    .eq('room_id', currentRoom.id)
    .eq('giver_id', participants[i].id)
    .eq('receiver_id', shuffled[i].id)
}
```

Si lo ves, el fix está aplicado ✅

---

## 🧪 Test completo

### 1. Limpiar datos antiguos (Opcional)

Si quieres empezar de cero:

```sql
-- En Supabase SQL Editor:
DELETE FROM secret_santa_assignments;
DELETE FROM room_participants;
DELETE FROM rooms WHERE status = 'completed';
```

### 2. Hacer un sorteo de prueba

1. **Crea cuenta de profesor** (si no tienes)
2. **Crea nueva sala:** "Test - Verificación Emails"
3. **Únete con 2 estudiantes:**
   - Email 1: Tu email real
   - Email 2: Otro email real (Gmail, Outlook, etc.)
4. **Haz el sorteo**
5. **Verifica:**
   - ✅ Los emails llegan (revisa spam)
   - ✅ En el modal de resultados dice "✓ Enviado"
   - ✅ En Resend Dashboard aparecen como "Delivered"

---

## 📊 Verificar en Resend Dashboard

1. Ve a [https://resend.com/emails](https://resend.com/emails)
2. Deberías ver tus emails enviados
3. Click en cada email para ver detalles:
   - **Status:** Delivered
   - **From:** onboarding@resend.dev
   - **To:** email del estudiante
   - **Subject:** 🎁 Tu Amigo Invisible - [Nombre Sala]

---

## 💡 Si los emails NO se están enviando

### Verificar en la consola del navegador:

Cuando hagas el sorteo, abre la consola (F12) y busca:

**Si ves:**
```
⚠️ Resend no está configurado. Email simulado en consola.
```
**Significa:** La API key no está cargada correctamente.

**Solución:**
1. Verifica `.env` tiene la línea correcta
2. Reinicia el servidor con `Ctrl+C` y `npm run dev`
3. Recarga la página en el navegador

---

**Si ves errores específicos:**
```
Error enviando email: { name: 'validation_error', ... }
```
**Copia el error completo** y revisa:
- Email del destinatario es válido
- API key es correcta
- No superaste límites de Resend

---

## 🆘 Si nada funciona

### Opción 1: Generar nueva API Key

1. Ve a [https://resend.com/api-keys](https://resend.com/api-keys)
2. **Revoca** la API key actual (si existe)
3. **Crea nueva:**
   - Nombre: `amigo-invisible-2025`
   - Permisos: **Full access** (para descartar problemas)
   - Click **"Create"**
4. **Copia la nueva key**
5. **Actualiza `.env`:**
   ```bash
   VITE_RESEND_API_KEY=re_NuevaKeyAqui
   ```
6. **Reinicia todo:**
   ```bash
   # Detén el servidor (Ctrl+C)
   npm run dev
   # Recarga el navegador
   ```

### Opción 2: Modo simulación (temporal)

Si necesitas probar sin emails reales:

```bash
# En .env, comenta o borra la API key:
# VITE_RESEND_API_KEY=re_xxx

# Reinicia el servidor
npm run dev
```

Los emails se simularán en la consola. No se envían realmente, pero puedes probar el sorteo.

---

## 📞 Contacto de soporte

Si sigues teniendo problemas:

1. Copia el error completo de la consola
2. Ve a [Resend Status](https://status.resend.com) - verifica que el servicio esté operativo
3. Revisa [Resend Docs](https://resend.com/docs)

---

**¡Suerte con la configuración! 🎉**
