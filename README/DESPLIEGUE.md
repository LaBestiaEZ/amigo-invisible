# 🚀 Guía de Despliegue en Vercel

## Paso 1: Preparar el proyecto

Tu proyecto ya está listo. Solo necesitas:

1. Tener el código en GitHub ✅ (Ya hecho)
2. Tener las variables de entorno

## Paso 2: Desplegar en Vercel

### 1. Ir a Vercel
https://vercel.com/signup

### 2. Iniciar sesión con GitHub
- Click en "Continue with GitHub"
- Autoriza Vercel

### 3. Import Project
- Click en "Add New..." → "Project"
- Busca: `amigo-invisible`
- Click en "Import"

### 4. Configurar el proyecto

**Framework Preset:** Vite (se detecta automáticamente)

**Build and Output Settings:**
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

### 5. Environment Variables (IMPORTANTE)

Click en "Environment Variables" y añade estas 3 variables:

```
VITE_SUPABASE_URL
https://enytyywaradkcnzgjake.supabase.co

VITE_SUPABASE_ANON_KEY
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVueXR5eXdhcmFka2NuemdqYWtlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4MTQ1NzcsImV4cCI6MjA3NzM5MDU3N30.MiR0Xe7YTXpTLLcFkOCGtkXffZKrOkVWlXW2xdMLnqk

VITE_RESEND_API_KEY
re_WyvwWCBM_Ac2uteuu3YsCK7Mfw5zyKBBY
```

### 6. Deploy
- Click en "Deploy"
- Espera 1-2 minutos ⏳
- ¡Listo! 🎉

## Tu URL será:

```
https://amigo-invisible-git-main-labeastiaez.vercel.app
```

O un dominio personalizado si quieres:
```
https://amigo-invisible.tudominio.com
```

---

## Configurar Supabase para producción

Después de desplegar, ve a Supabase:

1. **Dashboard → Authentication → URL Configuration**
2. **Site URL:** Poner tu URL de Vercel
3. **Redirect URLs:** Añadir:
   ```
   https://tu-url.vercel.app/**
   ```

---

## Despliegues automáticos

Cada vez que hagas `git push`, Vercel despliega automáticamente:

```bash
# 1. Hacer cambios en el código
# 2. Guardar en Git
git add .
git commit -m "Mejoras en la app"
git push

# 3. Vercel despliega automáticamente (30-60 segundos)
```

---

## Monitoreo y logs

En el dashboard de Vercel puedes ver:
- 📊 Analytics de visitas
- 🐛 Logs de errores
- ⚡ Performance
- 📈 Estadísticas

---

## Dominios personalizados (OPCIONAL)

Si tienes un dominio:

1. Vercel → Project → Settings → Domains
2. Add domain: `miapp.com`
3. Configurar DNS según instrucciones
4. ¡Listo!

---

## Troubleshooting

### Error: "Environment variables not found"
- Verifica que las 3 variables estén en Vercel
- Redeploy el proyecto

### Error 404 en rutas
- Vite + React Router necesita configuración
- Vercel lo maneja automáticamente

### Supabase no conecta
- Verifica la URL en Site URL de Supabase
- Añade el dominio a Redirect URLs

---

## ¿Problemas?

- 💬 Vercel Support: https://vercel.com/support
- 📖 Docs: https://vercel.com/docs
