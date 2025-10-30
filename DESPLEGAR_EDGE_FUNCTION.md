# 🚀 Desplegar Edge Function en Supabase

## ❌ Problema: Error de CORS

La API de Resend **NO permite** llamadas directas desde el navegador por seguridad.

**Error que veías:**
```
Access to fetch at 'https://api.resend.com/emails' from origin 'http://localhost:5173' 
has been blocked by CORS policy
```

## ✅ Solución: Supabase Edge Functions

Usamos una **Edge Function** (serverless) que:
1. Se ejecuta en el servidor de Supabase (no en el navegador)
2. Llama a Resend desde el backend
3. No tiene problemas de CORS

---

## 📝 Pasos para desplegar

### 1. Instalar Supabase CLI

**En PowerShell (como Administrador):**

```powershell
# Instalar Scoop (gestor de paquetes para Windows)
irm get.scoop.sh | iex

# Instalar Supabase CLI
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

**Verificar instalación:**
```powershell
supabase --version
```

### 2. Iniciar sesión en Supabase

```powershell
supabase login
```

Se abrirá el navegador para autenticarte.

### 3. Linkear tu proyecto

```powershell
cd C:\Users\Alumno\Desktop\amigo-invisible\amigo-invisible
supabase link --project-ref enytyywaradkcnzgjake
```

### 4. Configurar la API Key de Resend en Supabase

```powershell
supabase secrets set RESEND_API_KEY=re_WyvwWCBM_Ac2uteuu3YsCK7Mfw5zyKBBY
```

### 5. Desplegar la función

```powershell
supabase functions deploy send-secret-santa-email
```

---

## 🧪 Probar que funciona

1. **Recarga el navegador** (F5)
2. **Haz un nuevo sorteo**
3. **Los emails deberían enviarse** sin errores de CORS
4. **Verifica en Resend:** https://resend.com/emails

---

## 🔍 Verificar logs

Si hay errores, puedes ver los logs:

```powershell
supabase functions logs send-secret-santa-email
```

---

## ⚙️ Alternativa: Si no quieres instalar CLI

Puedes desplegar manualmente desde el Dashboard de Supabase:

1. Ve a: https://supabase.com/dashboard/project/enytyywaradkcnzgjake/functions
2. Click en **"Create a new function"**
3. Nombre: `send-secret-santa-email`
4. Copia el contenido de `supabase/functions/send-secret-santa-email/index.ts`
5. Click en **"Deploy function"**
6. Ve a **Settings** de la función
7. Añade variable de entorno:
   - Key: `RESEND_API_KEY`
   - Value: `re_WyvwWCBM_Ac2uteuu3YsCK7Mfw5zyKBBY`
8. Click en **"Save"**

---

## 📚 Documentación

- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Supabase CLI](https://supabase.com/docs/guides/cli)

---

¡Listo! Ahora los emails se enviarán desde el servidor sin problemas de CORS. 🎉
