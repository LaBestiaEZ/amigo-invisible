# 🎅 Amigo Invisible - Estilo Kahoot

Sistema interactivo de sorteo de amigo invisible para institutos con códigos QR, salas en tiempo real y notificaciones por email.

## ✨ Características

- 🔐 **Autenticación de profesores** - Cada profesor tiene su cuenta y puede recuperar sus salas
- 📊 **Dashboard de profesor** - Gestiona múltiples salas y ve el historial
- 🎯 **Salas con códigos únicos** - Como Kahoot, cada profesor crea una sala con un código
- 📱 **Códigos QR** - Los estudiantes pueden escanear el QR para unirse instantáneamente
- ⚡ **Tiempo real** - Los participantes aparecen en vivo cuando se unen
- 📧 **Emails automáticos** - Cada estudiante recibe su amigo invisible por email
- 🎨 **Diseño moderno** - Interfaz vibrante y atractiva estilo Kahoot
- 🔒 **Anonimidad garantizada** - Solo el estudiante sabe quién le tocó

## 🚀 Configuración

### 1. Configurar Supabase

1. Crea una cuenta en [Supabase](https://supabase.com)
2. Crea un nuevo proyecto
3. Ve a **SQL Editor** y ejecuta el script `supabase-setup.sql` completo
4. Ve a **Database > Replication** y verifica que las tablas tengan Realtime habilitado
5. Ve a **Authentication > Providers** y asegúrate que Email está habilitado

### 2. Configurar Variables de Entorno

1. Copia el archivo `.env.example` a `.env`
2. Ve a **Settings > API** en Supabase y copia:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon/public key** → `VITE_SUPABASE_ANON_KEY`
3. Ve a [Resend](https://resend.com) y crea una cuenta
4. Obtén tu API key en **API Keys** → `VITE_RESEND_API_KEY`

```env
VITE_SUPABASE_URL=https://tuproyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-anon-key
VITE_RESEND_API_KEY=re_tu_api_key_aqui
```

**Nota:** Si no configuras Resend, los emails se simularán (verás los datos en la consola).

### 3. Ejecutar la aplicación

```bash
npm install
npm run dev
```

## 📖 Cómo usar

### Para Profesores:

1. Haz clic en **"Soy Profesor"**
2. **Crea una cuenta** o **inicia sesión** (tu email será tu usuario)
3. En el dashboard, crea una nueva sala con un nombre
4. Comparte el **código de sala** o muestra el **código QR**
5. Espera a que los estudiantes se unan (verás la lista actualizarse en tiempo real)
6. Cuando todos estén listos, haz clic en **"Realizar Sorteo"**
7. ¡Listo! Cada estudiante recibirá un email con su amigo invisible
8. **Puedes recuperar tus salas** - Al iniciar sesión verás todas tus salas anteriores

### Para Estudiantes:

1. Haz clic en **"Soy Estudiante"**
2. Ingresa el código de la sala (o escanea el QR)
3. Escribe tu nombre completo y email
4. Espera a que el profesor haga el sorteo
5. ¡Recibirás un email con tu amigo invisible!

## 🛠️ Tecnologías

- **React 19** - Framework UI
- **Vite** - Build tool
- **Supabase** - Base de datos, Autenticación y Realtime
- **Resend** - Servicio de envío de emails
- **QRCode.react** - Generación de códigos QR
- **UUID** - Generación de IDs únicos

## 📧 Configuración de Emails con Resend

### 🚀 Opción 1: Sin dominio (GRATIS - Recomendado para empezar)

✅ **Configuración en 2 minutos** - Emails desde `onboarding@resend.dev`

1. Crea cuenta en [Resend](https://resend.com) (gratis: 100 emails/día, 3000/mes)
2. Ve a **API Keys** y crea una nueva clave
3. Añade la clave a tu archivo `.env`:
   ```bash
   VITE_RESEND_API_KEY=re_tu_api_key
   ```
4. ¡Listo! Los emails se envían automáticamente

**Limitaciones:** Los emails vienen de `onboarding@resend.dev` y pueden ir a spam.

### 🏢 Opción 2: Con dominio propio (Recomendado para producción)

✅ **Emails profesionales** desde `noreply@tuinstituto.edu`

1. Ya tienes Resend configurado (Opción 1) ✓
2. Añade tu dominio en [Resend Domains](https://resend.com/domains)
3. Verifica registros DNS (SPF, DKIM, DMARC)
4. Añade a tu `.env`:
   ```bash
   VITE_EMAIL_DOMAIN=tuinstituto.edu
   ```
5. Reinicia el servidor: `npm run dev`

**Ventajas:** Menos spam, aspecto profesional, mayor confianza.

📚 **Guía completa:** Lee `EMAIL_SETUP.md` para instrucciones detalladas.

### 🧪 Sin Resend (modo simulación):

Si no configuras la API key:
- ✅ El sorteo funciona normalmente
- ⚠️ Los emails se simulan en la consola
- ❌ Los estudiantes NO reciben emails reales

## 📊 Estructura de la Base de Datos

- **auth.users** - Usuarios autenticados (profesores)
- **rooms** - Salas creadas por profesores (vinculadas a auth.users)
- **room_participants** - Estudiantes en cada sala
- **secret_santa_assignments** - Asignaciones del sorteo

## 🎨 Personalización

Puedes personalizar los colores editando los archivos CSS:
- Gradientes principales: `#667eea` y `#764ba2`
- Color de éxito: `#4caf50`
- Color de error: `#f44336`

## 📝 Notas

- Los profesores necesitan confirmar su email al registrarse (revisa spam)
- Cada profesor solo ve sus propias salas (seguridad RLS)
- Mínimo 2 participantes por sala
- El algoritmo asegura que nadie se regale a sí mismo
- Las salas quedan en estado "completado" después del sorteo
- Los participantes ven actualizaciones en tiempo real
- Puedes recuperar tus salas iniciando sesión en cualquier momento

---

¡Disfruta organizando tu amigo invisible! 🎁✨

