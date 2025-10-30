# 📧 Guía de Configuración de Emails

## ✅ Resend YA ESTÁ INTEGRADO

La aplicación ya tiene Resend integrado y listo para usar. Solo necesitas configurar tu API key.

## 🚀 Configuración Rápida (Recomendado)

### 1. Crear cuenta en Resend

1. Ve a [Resend.com](https://resend.com)
2. Crea una cuenta gratuita (100 emails/día gratis)
3. Verifica tu email

### 2. Obtener API Key

1. Ve a [API Keys](https://resend.com/api-keys)
2. Haz clic en **"Create API Key"**
3. Dale un nombre (ej: "Amigo Invisible")
4. Copia la clave que empieza con `re_`

### 3. Configurar en tu aplicación

Edita tu archivo `.env` y añade:

```env
VITE_RESEND_API_KEY=re_tu_api_key_aqui
```

### 4. ¡Listo!

Reinicia el servidor (`npm run dev`) y los emails se enviarán automáticamente cuando hagas un sorteo.

---

## 📋 Características del sistema de emails

### ✨ Lo que incluye:

- ✅ **Email HTML personalizado** con diseño atractivo
- ✅ **Envío automático** al completar el sorteo
- ✅ **Información del amigo invisible** de forma clara
- ✅ **Rate limiting** para evitar bloqueos
- ✅ **Manejo de errores** robusto
- ✅ **Modo simulación** si no hay API key

### 📧 Configuración de Emails con Resend

Esta aplicación usa **Resend** para enviar emails del sorteo. Puedes empezar **GRATIS** sin dominio propio y migrar a un dominio personalizado cuando quieras.

---

## 🚀 Opción 1: Configuración Rápida (SIN DOMINIO - GRATIS)

### ✅ Ventajas:
- ✨ **100% gratis** (100 emails/día, 3000/mes)
- ⚡ **Configuración en 2 minutos**
- 🎯 **Funciona inmediatamente**
- 📱 **Perfecto para probar**

### ⚠️ Limitaciones:
- Los emails vienen desde `onboarding@resend.dev`
- Pueden ir a spam en algunos casos
- No puedes personalizar el remitente

### 📝 Pasos:

#### 1. Crear cuenta en Resend (GRATIS)
- Ve a [https://resend.com/signup](https://resend.com/signup)
- Regístrate con tu email
- Confirma tu email

#### 2. Obtener API Key
- Ve a [https://resend.com/api-keys](https://resend.com/api-keys)
- Click en **"Create API Key"**
- Nombre: `amigo-invisible`
- Permisos: `Sending access`
- Click en **"Add"**
- **Copia la key** (empieza con `re_...`)

#### 3. Configurar en tu proyecto
Edita el archivo `.env`:

```bash
VITE_RESEND_API_KEY=re_TuApiKeyAqui123456789
```

**NO configures** `VITE_EMAIL_DOMAIN` (déjalo comentado)

#### 4. ¡Listo!
- Reinicia el servidor: `npm run dev`
- Los emails se enviarán desde `onboarding@resend.dev`
- Funciona inmediatamente, sin configuración adicional

---

## 🏢 Opción 2: Dominio Personalizado (RECOMENDADO PARA PRODUCCIÓN)

### ✅ Ventajas:
- 📧 Emails desde tu dominio: `noreply@tuinstituto.edu`
- 🎯 **Menor probabilidad de spam**
- 🏆 **Aspecto más profesional**
- ✅ **Mayor confianza de los usuarios**

### 📋 Requisitos:
- Tener un dominio propio
- Acceso al panel DNS del dominio
- 15-30 minutos para configuración

### 📝 Pasos:

#### 1. Ya tienes cuenta y API Key de Resend ✓
(Del paso anterior - si no, ve a Opción 1 primero)

#### 2. Añadir dominio en Resend
- Ve a [https://resend.com/domains](https://resend.com/domains)
- Click en **"Add Domain"**
- Introduce tu dominio: `tuinstituto.edu`
- Click en **"Add"**

#### 3. Verificar dominio (Configuración DNS)
Resend te mostrará 3 registros DNS que debes añadir:

**Registro SPF:**
```
Type: TXT
Name: @
Value: v=spf1 include:resend.io ~all
```

**Registro DKIM:**
```
Type: TXT
Name: resend._domainkey
Value: [valor proporcionado por Resend]
```

**Registro DMARC (opcional pero recomendado):**
```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:dmarc@tuinstituto.edu
```

#### 4. Añadir registros en tu proveedor DNS

**Ejemplos según proveedor:**

<details>
<summary><b>Cloudflare</b></summary>

1. Ve a tu dominio en Cloudflare
2. Click en **DNS** → **Records**
3. Click **Add record**
4. Añade cada registro (Type, Name, Content)
5. Click **Save**
</details>

<details>
<summary><b>GoDaddy</b></summary>

1. Ve a **DNS Management**
2. Click **Add** en la sección DNS
3. Selecciona tipo **TXT**
4. Introduce Name y Value
5. Click **Save**
</details>

<details>
<summary><b>Namecheap</b></summary>

1. Ve a **Advanced DNS**
2. Click **Add New Record**
3. Tipo: **TXT Record**
4. Host: según el registro
5. Value: el valor proporcionado
6. Click **Save**
</details>

<details>
<summary><b>Google Domains</b></summary>

1. Ve a **DNS** en el panel
2. Scroll hasta **Custom records**
3. Click **Manage custom records**
4. Click **Create new record**
5. Introduce los datos
6. Click **Save**
</details>

#### 5. Verificar en Resend
- Vuelve a [https://resend.com/domains](https://resend.com/domains)
- Click en **"Verify"** junto a tu dominio
- ⏳ Puede tardar hasta 48 horas (normalmente 15-30 min)
- ✅ Verás "Verified" cuando esté listo

#### 6. Configurar en tu proyecto
Edita el archivo `.env`:

```bash
VITE_RESEND_API_KEY=re_TuApiKeyAqui123456789
VITE_EMAIL_DOMAIN=tuinstituto.edu
```

#### 7. Reiniciar servidor
```bash
npm run dev
```

#### 8. ¡Listo!
Los emails se enviarán desde: `noreply@tuinstituto.edu`

---

## 🔄 Migración: De Dominio de Prueba → Dominio Propio

Si ya tienes la app funcionando con el dominio de prueba y quieres migrar:

1. **Sigue los pasos de Opción 2** (configurar dominio)
2. **Añade la variable** al `.env`:
   ```bash
   VITE_EMAIL_DOMAIN=tuinstituto.edu
   ```
3. **Reinicia el servidor**
4. **¡Sin más cambios!** El código detecta automáticamente el dominio

---

## 🧪 Probar que funciona

### Test rápido:

1. **Crea una sala** como profesor
2. **Únete como 2-3 estudiantes** (usa emails reales)
3. **Haz el sorteo**
4. **Revisa los emails** (puede estar en spam la primera vez)

### Ver logs en Resend:

- Ve a [https://resend.com/emails](https://resend.com/emails)
- Verás todos los emails enviados
- Estados: **Delivered**, **Bounced**, **Failed**

---

## 🐛 Solución de problemas

### ❌ "Missing API key"
**Problema:** La API key no está configurada o es inválida

**Solución:**
```bash
# Verifica que esté en .env
VITE_RESEND_API_KEY=re_...

# Reinicia el servidor
npm run dev
```

### ❌ Los emails no llegan
**Posibles causas:**

1. **Están en spam** → Revisa carpeta spam/correo no deseado
2. **Email inválido** → Verifica que los emails sean correctos
3. **Dominio no verificado** → Si usas dominio propio, verifica en Resend
4. **Límite alcanzado** → Plan gratuito: 100/día, 3000/mes

**Verificar:**
- Ve a [https://resend.com/emails](https://resend.com/emails)
- Busca el email enviado
- Revisa el estado y errores

### ❌ "Domain not verified"
**Problema:** Intentas usar dominio propio pero no está verificado

**Solución:**
1. Ve a [https://resend.com/domains](https://resend.com/domains)
2. Verifica que el dominio esté **"Verified"**
3. Si no, revisa los registros DNS
4. Espera 15-30 minutos tras configurar DNS
5. Mientras tanto, **comenta** `VITE_EMAIL_DOMAIN` en `.env` para usar dominio de prueba

### ❌ Emails van a spam
**Soluciones:**

**A corto plazo:**
- Pide a los estudiantes que marquen como "No es spam"
- Añade `onboarding@resend.dev` o `noreply@tudominio.com` a contactos

**A largo plazo:**
- Usa dominio propio verificado
- Configura registros SPF, DKIM y DMARC correctamente
- Mantén baja tasa de rebote (emails válidos)

---

## 📊 Límites del Plan Gratuito

| Concepto | Límite |
|----------|--------|
| Emails por día | 100 |
| Emails por mes | 3,000 |
| Dominios | 1 dominio verificado |
| APIs keys | Ilimitadas |
| Logs | 30 días |

**¿Suficiente para ti?**
- ✅ Instituto pequeño: 1-3 clases → **Sí**
- ✅ Instituto mediano: 5-10 clases → **Sí** (si haces sorteos escalonados)
- ⚠️ Instituto grande: 20+ clases → Considera plan de pago ($20/mes)

---

## 🎯 Mejores prácticas

### ✅ Hacer:
- Usa emails válidos de estudiantes
- Haz pruebas con emails reales antes del sorteo final
- Verifica dominio si usas uno propio
- Informa a estudiantes que revisen spam la primera vez

### ❌ Evitar:
- No usar emails temporales/falsos
- No exceder límites del plan gratuito
- No olvidar reiniciar servidor tras cambiar `.env`

---

## 💡 Preguntas frecuentes

### ¿Necesito un dominio propio?
**No.** Puedes empezar GRATIS con `onboarding@resend.dev`. Funciona perfectamente para probar.

### ¿Cuánto cuesta un dominio?
Desde **$10-15/año** en registradores como Namecheap, GoDaddy, Cloudflare.

### ¿Los estudiantes ven mi API key?
**No.** Las variables `VITE_*` en `.env` NO se exponen en el frontend con credenciales. Resend se llama desde el cliente pero la key es necesaria.

**⚠️ IMPORTANTE:** En producción, considera mover el envío de emails al backend para mayor seguridad.

### ¿Puedo usar Gmail/Outlook en lugar de Resend?
Sí, pero es más complicado y tiene límites más estrictos. Resend está diseñado para esto y es más fácil.

### ¿Qué pasa si alcanzo el límite de 100 emails/día?
- Espera hasta el día siguiente (se resetea a medianoche UTC)
- O actualiza al plan de pago ($20/mes para 50,000 emails/mes)

### ¿Puedo ver quién recibió el email?
Sí, en [https://resend.com/emails](https://resend.com/emails) ves todos los envíos y estados.

---

## 🔗 Enlaces útiles

- [Resend Dashboard](https://resend.com/dashboard)
- [API Keys](https://resend.com/api-keys)
- [Dominios](https://resend.com/domains)
- [Logs de emails](https://resend.com/emails)
- [Documentación oficial](https://resend.com/docs)
- [Pricing](https://resend.com/pricing)

---

## 📞 Soporte

¿Problemas con la configuración? Revisa:
1. Este documento completo
2. El README.md del proyecto
3. Logs en la consola del navegador (F12)
4. [Resend Status](https://status.resend.com)

---

**¡Listo para enviar emails! 🎉**

Los estudiantes reciben un email con:
- Saludo personalizado con su nombre
- El nombre de su amigo invisible destacado
- El nombre de la sala/clase
- Diseño festivo con emojis y colores

### 🔍 Verificar envío:

Puedes ver el estado de los emails en:
1. **Consola del navegador** - Logs de envío
2. **Dashboard de Resend** - Todos los emails enviados
3. **Bandeja del destinatario** - Email recibido

---

## 🌐 Usar tu propio dominio (Opcional)

Por defecto se usa `onboarding@resend.dev`. Para profesionalizar:

### 1. Verificar dominio en Resend

1. Ve a [Domains](https://resend.com/domains) en Resend
2. Haz clic en **"Add Domain"**
3. Ingresa tu dominio (ej: `instituto.edu`)
4. Sigue las instrucciones para verificar (DNS)

### 2. Actualizar el código

Edita `src/lib/emailService.js` línea 20:

```javascript
from: 'Amigo Invisible <noreply@tuinstituto.edu>'
```

Reinicia el servidor y los emails se enviarán desde tu dominio.

---

### Paso 1: Configurar Resend
1. Crea una cuenta en [Resend](https://resend.com)
2. Obtén tu API Key
3. Verifica tu dominio (o usa el dominio de prueba)

### Paso 2: Crear Edge Function en Supabase
```bash
# En tu proyecto de Supabase
supabase functions new send-secret-santa-email
```

### Paso 3: Código de la Edge Function
```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

serve(async (req) => {
  const { giverName, giverEmail, receiverName } = await req.json()

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${RESEND_API_KEY}`
    },
    body: JSON.stringify({
      from: 'Amigo Invisible <noreply@tudominio.com>',
      to: [giverEmail],
      subject: '🎁 Tu Amigo Invisible ha sido asignado',
      html: `
        <h1>¡Hola ${giverName}! 🎅</h1>
        <p>Tu amigo invisible es:</p>
        <h2 style="color: #667eea;">${receiverName}</h2>
        <p>¡Empieza a pensar en el regalo perfecto! 🎁</p>
      `
    })
  })

  return new Response(JSON.stringify(await res.json()), {
    headers: { 'Content-Type': 'application/json' }
  })
})
```

### Paso 4: Actualizar App.jsx
```javascript
const sendEmails = async (givers, receivers) => {
  for (let i = 0; i < givers.length; i++) {
    const giver = givers[i]
    const receiver = receivers[i]
    
    await supabase.functions.invoke('send-secret-santa-email', {
      body: {
        giverName: giver.name,
        giverEmail: giver.email,
        receiverName: receiver.name
      }
    })
  }
}
```

---

## Opción 2: EmailJS (Más Fácil)

### Paso 1: Configurar EmailJS
1. Crea cuenta en [EmailJS](https://www.emailjs.com/)
2. Crea un servicio de email (Gmail, Outlook, etc.)
3. Crea una plantilla de email
4. Obtén tu Service ID, Template ID y Public Key

### Paso 2: Instalar EmailJS
```bash
npm install @emailjs/browser
```

### Paso 3: Actualizar App.jsx
```javascript
import emailjs from '@emailjs/browser'

const sendEmails = async (givers, receivers) => {
  emailjs.init('TU_PUBLIC_KEY')
  
  for (let i = 0; i < givers.length; i++) {
    const giver = givers[i]
    const receiver = receivers[i]
    
    await emailjs.send(
      'TU_SERVICE_ID',
      'TU_TEMPLATE_ID',
      {
        to_email: giver.email,
        to_name: giver.name,
        receiver_name: receiver.name
      }
    )
  }
}
```

### Plantilla EmailJS:
```
Asunto: 🎁 Tu Amigo Invisible

Hola {{to_name}},

¡Tu amigo invisible ha sido asignado!

Tu amigo invisible es: {{receiver_name}}

¡Empieza a pensar en el regalo perfecto! 🎁

Saludos,
El equipo de Amigo Invisible
```

---

## Opción 3: SendGrid

### Paso 1: Configurar SendGrid
1. Crea cuenta en [SendGrid](https://sendgrid.com/)
2. Obtén tu API Key
3. Verifica tu dominio de envío

### Paso 2: Instalar SendGrid
```bash
npm install @sendgrid/mail
```

### Paso 3: Crear API endpoint
Necesitarás un backend (Node.js, Express) o usar Edge Functions de Supabase.

---

## Opción 4: Nodemailer (Requiere Backend)

Si tienes un servidor Node.js:

```javascript
const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'tu-email@gmail.com',
    pass: 'tu-password-de-aplicacion'
  }
})

const sendEmails = async (givers, receivers) => {
  for (let i = 0; i < givers.length; i++) {
    const giver = givers[i]
    const receiver = receivers[i]
    
    await transporter.sendMail({
      from: '"Amigo Invisible" <noreply@tudominio.com>',
      to: giver.email,
      subject: '🎁 Tu Amigo Invisible',
      html: `
        <h1>¡Hola ${giver.name}!</h1>
        <p>Tu amigo invisible es: <strong>${receiver.name}</strong></p>
      `
    })
  }
}
```

---

## 🎯 Recomendación

Para institutos, la mejor opción es:
- **EmailJS** si quieres algo rápido y fácil (gratis hasta 200 emails/mes)
- **Resend + Supabase Edge Functions** si quieres algo más profesional y escalable

---

## ⚠️ Nota de Seguridad

- **NUNCA** pongas API keys directamente en el código frontend
- Usa variables de entorno (`.env`) o Edge Functions
- Para producción, valida los emails antes de enviar
- Implementa rate limiting para evitar spam

---

## 📝 Variables de Entorno Adicionales

Si usas un servicio de email, añade al `.env`:

```env
VITE_EMAILJS_SERVICE_ID=tu-service-id
VITE_EMAILJS_TEMPLATE_ID=tu-template-id
VITE_EMAILJS_PUBLIC_KEY=tu-public-key
```

O para Resend (en Supabase secrets):
```env
RESEND_API_KEY=re_xxxxxxxxxxxxx
```
