# 📧 Desactivar confirmación de email en Supabase

## Opción 1: Desde el Dashboard de Supabase (RECOMENDADO)

### Pasos:

1. **Accede a tu proyecto en Supabase:**
   - Ve a https://supabase.com/dashboard
   - Selecciona tu proyecto

2. **Ve a Authentication → Providers:**
   - En el menú lateral: `Authentication` → `Providers`
   - Busca la sección **Email**

3. **Desactiva "Confirm email":**
   - Haz clic en **Email** para editarlo
   - Busca la opción **"Confirm email"**
   - **Desactívala** (toggle OFF)
   - Haz clic en **Save**

4. **¡Listo!** Ahora los profesores pueden registrarse sin confirmar el email.

---

## Opción 2: Desde SQL (Alternativa)

Si prefieres hacerlo con SQL, ejecuta esto en el **SQL Editor** de Supabase:

```sql
-- Desactivar confirmación de email
UPDATE auth.config 
SET confirm_email_change_enabled = false;
```

⚠️ **Nota:** Esto puede no funcionar en todas las versiones de Supabase. Usa la Opción 1.

---

## Verificar que funciona

1. **Prueba registrando una cuenta:**
   - Ve a tu aplicación
   - Crea una cuenta de profesor con cualquier email
   - Deberías poder iniciar sesión **inmediatamente**

2. **Verifica en Supabase:**
   - Ve a `Authentication` → `Users`
   - Busca tu usuario recién creado
   - En la columna **"Email Confirmed At"** debería aparecer la fecha actual

---

## ⚙️ Configuración completa de Email Provider

### Settings recomendados:

```
Email Provider Settings:

✅ Enable Email provider: ON
❌ Confirm email: OFF           ← IMPORTANTE
❌ Secure email change: OFF     ← Opcional
✅ Enable sign ups: ON
```

### Redirect URLs (si necesitas):

Si más adelante quieres usar confirmación de email, añade:
```
Site URL: http://localhost:5174
Redirect URLs: http://localhost:5174/**
```

---

## 🔒 Seguridad

### ¿Es seguro desactivar la confirmación?

Para tu caso de uso (instituto, profesores conocidos):
- ✅ **SÍ**, es seguro
- Los profesores son personas reales del instituto
- No es una app pública con millones de usuarios

### Recomendaciones:
- Usa emails corporativos del instituto (@tuinstituto.edu)
- Mantén las contraseñas fuertes (mínimo 6 caracteres)
- Activa la confirmación cuando tengas emails configurados

---

## 🚀 Flujo después de desactivar

### Registro de profesor:
1. Profesor introduce: email + contraseña
2. ✅ Cuenta creada **inmediatamente**
3. ✅ Puede iniciar sesión **sin esperar**
4. ✅ Puede crear salas y hacer sorteos

### No más:
❌ "Revisa tu email para confirmar"
❌ Emails de confirmación que nunca llegan
❌ Profesores esperando horas

---

## 📝 Actualizar documentación

Después de desactivar la confirmación, actualiza tu `README.md`:

```markdown
## 👨‍🏫 Registro de profesores

Los profesores pueden crear una cuenta directamente:
- No necesitan confirmar email
- Acceso inmediato al dashboard
- Pueden crear salas y hacer sorteos

Para activar la confirmación de email más adelante, consulta `CONFIGURACION_SUPABASE.md`
```

---

## ❓ Preguntas frecuentes

### ¿Los estudiantes necesitan cuenta?
No. Solo los profesores necesitan autenticación.

### ¿Puedo reactivar la confirmación después?
Sí, simplemente activa "Confirm email" en el dashboard.

### ¿Afecta a los emails del sorteo?
No. Los emails del sorteo usan Resend, son independientes.

### ¿Y si un profesor pone un email falso?
Puede crear la cuenta, pero no recibirá notificaciones. Los emails del sorteo van a los estudiantes, no al profesor.

---

## 🎯 Resumen rápido

```bash
1. Ve a: Supabase Dashboard → Authentication → Providers
2. Click en: Email
3. Desactiva: "Confirm email"
4. Click en: Save
5. ¡Listo! Los profesores ya pueden registrarse sin confirmar
```

---

## 🔗 Enlaces útiles

- [Supabase Auth Settings](https://supabase.com/dashboard/project/_/auth/providers)
- [Documentación oficial](https://supabase.com/docs/guides/auth/auth-email)
