# Configuración de Gmail para envío de emails

## 1. Obtener contraseña de aplicación de Gmail

1. Ve a tu cuenta de Google: https://myaccount.google.com/
2. Haz clic en **Seguridad** en el menú lateral
3. En "Cómo inicias sesión en Google", activa la **Verificación en dos pasos** (si no la tienes activada)
4. Una vez activada, busca **Contraseñas de aplicaciones**
5. Selecciona:
   - App: **Correo**
   - Dispositivo: **Otro (nombre personalizado)** → escribe "Amigo Invisible"
6. Haz clic en **Generar**
7. Copia la contraseña de 16 caracteres que aparece (sin espacios)

## 2. Configurar variables en Supabase

1. Ve a tu proyecto en Supabase: https://supabase.com/dashboard
2. Selecciona tu proyecto
3. Ve a **Settings** → **Edge Functions**
4. En la sección **Secrets**, añade estas dos variables:

```
GMAIL_USER = tu-correo@gmail.com
GMAIL_APP_PASSWORD = tu-contraseña-de-aplicacion-de-16-caracteres
```

**IMPORTANTE:** 
- `GMAIL_USER` debe ser tu dirección de Gmail completa (ej: `ejemplo@gmail.com`)
- `GMAIL_APP_PASSWORD` es la contraseña de aplicación de 16 caracteres que generaste (sin espacios)
- **NO uses tu contraseña normal de Gmail**

## 3. Desplegar la función actualizada

Después de configurar las variables, despliega la función:

```bash
npx supabase functions deploy send-secret-santa-email
```

## 4. Probar el envío

Una vez desplegada, prueba enviando emails desde la aplicación. Los emails se enviarán desde tu cuenta de Gmail.

## Troubleshooting

### Error: "Invalid login"
- Verifica que la verificación en dos pasos esté activada
- Asegúrate de usar la contraseña de aplicación, no tu contraseña normal
- Revisa que no haya espacios en la contraseña

### Error: "GMAIL_USER o GMAIL_APP_PASSWORD no configuradas"
- Verifica que las variables estén configuradas en Supabase Edge Functions Secrets
- Redespliega la función después de añadir las variables

### Los emails van a spam
- Es normal al principio. Pide a los destinatarios que marquen como "No es spam"
- Con el tiempo Gmail aprenderá y no los marcará como spam

### Límite de envío
Gmail tiene un límite de **500 emails por día** para cuentas normales.
