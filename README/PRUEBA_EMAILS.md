# 🧪 Probar envío de emails

Puedes probar el envío de emails sin hacer un sorteo completo usando la consola del navegador.

## Prueba rápida desde la consola

1. Abre la aplicación en el navegador
2. Abre la consola de desarrollo (F12)
3. Ejecuta este código:

```javascript
// Importar el servicio de emails
import { sendSecretSantaEmail } from './src/lib/emailService'

// Enviar un email de prueba
sendSecretSantaEmail(
  'Tu Nombre',           // Nombre del que recibe
  'tuemail@ejemplo.com', // Email del destinatario
  'María García',        // Nombre del amigo invisible
  'Prueba - 4ºA'        // Nombre de la sala
).then(result => {
  console.log('Resultado:', result)
})
```

## Verificar en Resend Dashboard

1. Ve a [Resend Logs](https://resend.com/emails)
2. Deberías ver el email enviado
3. Verifica el estado: "Delivered" o "Bounced"

## Códigos de respuesta

### ✅ Éxito
```javascript
{
  success: true,
  data: { id: "xxx..." }
}
```

### ❌ Error común: API key inválida
```javascript
{
  success: false,
  error: "Missing API key"
}
```
**Solución:** Verifica que la API key en `.env` sea correcta

### ❌ Error: Email inválido
```javascript
{
  success: false,
  error: "Invalid email address"
}
```
**Solución:** Usa un email válido

### ⚠️ Modo simulación
```javascript
{
  success: true,
  simulated: true
}
```
**Significa:** No hay API key configurada, el email se simuló en la consola

## Verificar configuración

Ejecuta esto en la consola para ver tu configuración:

```javascript
console.log('Resend configurado:', !!import.meta.env.VITE_RESEND_API_KEY)
console.log('API Key:', import.meta.env.VITE_RESEND_API_KEY?.substring(0, 10) + '...')
```

## Solución de problemas

### El email no llega

1. **Revisa spam/correo no deseado**
2. **Verifica en Resend Dashboard** si se envió
3. **Comprueba el email** que sea válido
4. **Revisa los logs** de la consola

### Error "Missing API key"

1. Verifica que `.env` tenga `VITE_RESEND_API_KEY=re_...`
2. **Reinicia el servidor** (`npm run dev`)
3. Verifica que la clave empiece con `re_`

### Email se envía pero no tiene diseño

Esto es normal en algunos clientes de email. El HTML debería verse bien en Gmail, Outlook, etc.

## Límites de Resend (Plan Gratuito)

- 100 emails por día
- 3,000 emails por mes
- Perfecto para institutos pequeños/medianos

Si necesitas más, considera el plan de pago o usa múltiples cuentas.
