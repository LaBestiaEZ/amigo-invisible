# 🔄 Migración Rápida: Dominio de Prueba → Dominio Propio

Si ya tienes la aplicación funcionando con `onboarding@resend.dev` y quieres migrar a tu dominio:

## ✅ Checklist previo

- [ ] Tengo un dominio propio
- [ ] Tengo acceso al panel DNS del dominio
- [ ] Resend ya está configurado y funcionando
- [ ] Tengo 15-30 minutos disponibles

## 🚀 Pasos de migración

### 1. Añadir dominio en Resend

Ve a [https://resend.com/domains](https://resend.com/domains)

```
Click en "Add Domain"
→ Introduce: tuinstituto.edu
→ Click "Add"
```

### 2. Obtener registros DNS

Resend te mostrará 3 registros. **Cópialos** (los necesitarás):

#### Registro SPF:
```
Type: TXT
Name: @
Value: v=spf1 include:resend.io ~all
```

#### Registro DKIM:
```
Type: TXT  
Name: resend._domainkey
Value: [valor único que te da Resend]
```

#### Registro DMARC (opcional):
```
Type: TXT
Name: _dmarc  
Value: v=DMARC1; p=none;
```

### 3. Configurar DNS

Ve al panel de tu proveedor de dominio:

**Ejemplos comunes:**
- **Cloudflare:** DNS → Records → Add record
- **GoDaddy:** DNS Management → Add → TXT Record
- **Namecheap:** Advanced DNS → Add New Record
- **Google Domains:** DNS → Custom records → Create

**Para cada registro:**
1. Tipo: **TXT**
2. Name/Host: El que indica Resend
3. Value/Content: El valor que te dio Resend
4. TTL: **Auto** o **3600**
5. Guardar

### 4. Verificar dominio

Vuelve a Resend:

```
https://resend.com/domains
→ Click "Verify" junto a tu dominio
```

**Tiempos de verificación:**
- ⚡ Rápido: 5-15 minutos
- 🕐 Normal: 30 minutos - 2 horas  
- 🐌 Lento: Hasta 48 horas (raro)

**Mientras esperas:** La app sigue funcionando con `onboarding@resend.dev`

### 5. Actualizar configuración

Cuando el dominio esté **✅ Verified** en Resend:

**Edita `.env`:**
```bash
# Ya tienes esto:
VITE_RESEND_API_KEY=re_tu_api_key

# AÑADE esta línea:
VITE_EMAIL_DOMAIN=tuinstituto.edu
```

### 6. Reiniciar servidor

```bash
npm run dev
```

### 7. ¡Migración completada! 🎉

**Ahora los emails se envían desde:**
```
noreply@tuinstituto.edu
```

**Sin cambios de código necesarios** - todo es automático.

---

## 🧪 Verificar que funciona

### Prueba rápida:

1. Crea una sala de prueba
2. Únete con 2 emails reales
3. Haz el sorteo
4. Revisa los emails (puede estar en spam la primera vez)

### Verificar remitente:

En el email recibido, verifica que el remitente sea:
```
Amigo Invisible <noreply@tuinstituto.edu>
```

Y NO:
```
Amigo Invisible <onboarding@resend.dev>
```

### Ver logs en Resend:

Ve a [https://resend.com/emails](https://resend.com/emails)
- Estado: **Delivered** ✅
- From: `noreply@tuinstituto.edu`

---

## 🐛 Solución de problemas

### ❌ "Domain not verified"

**El dominio aún no está verificado en Resend.**

**Solución:**
1. Ve a [https://resend.com/domains](https://resend.com/domains)
2. Si dice "Pending", espera más tiempo
3. Si dice "Failed", revisa los registros DNS
4. Usa herramienta de verificación: [MXToolbox](https://mxtoolbox.com/SuperTool.aspx)

**Mientras tanto:**
```bash
# Comenta la línea en .env para volver al dominio de prueba:
# VITE_EMAIL_DOMAIN=tuinstituto.edu
```

### ❌ Los registros DNS no se propagan

**Puede tomar tiempo.**

**Verificar propagación:**
- [DNS Checker](https://dnschecker.org)
- Introduce tu dominio y busca registros TXT

**Tips:**
- Espera 15-30 minutos mínimo
- Limpia caché DNS: `ipconfig /flushdns` (Windows)
- Prueba en modo incógnito

### ❌ Los emails van a spam

**Normal la primera vez. Mejora con el tiempo.**

**Soluciones:**
1. Pide marcar como "No es spam"
2. Verifica DMARC esté configurado
3. Añade el remitente a contactos
4. Envía volumen bajo al inicio (construye reputación)

---

## 🔄 Volver al dominio de prueba

Si tienes problemas y quieres volver:

```bash
# En .env, comenta o elimina:
# VITE_EMAIL_DOMAIN=tuinstituto.edu

# Reinicia:
npm run dev
```

Los emails volverán a enviarse desde `onboarding@resend.dev`

---

## 📊 Comparativa

| Característica | Dominio de prueba | Dominio propio |
|----------------|-------------------|----------------|
| Remitente | `onboarding@resend.dev` | `noreply@tuinstituto.edu` |
| Configuración | 2 minutos | 30 minutos |
| Costo | Gratis | Gratis (con dominio que ya tengas) |
| Spam | Mayor probabilidad | Menor probabilidad |
| Profesionalidad | Básica | Alta |
| Límites | Iguales (100/día) | Iguales (100/día) |

---

## 💡 Consejos

### ✅ Hacer:
- Configura los 3 registros DNS (SPF, DKIM, DMARC)
- Espera pacientemente la verificación
- Prueba con emails reales antes del sorteo importante
- Guarda los valores DNS en un documento

### ❌ Evitar:
- Cambiar registros DNS mientras verificas
- Usar subdominios (usa dominio raíz)
- Impacientarse (DNS puede tardar)
- Olvidar reiniciar el servidor

---

## 🎯 Resultado final

**Antes de migrar:**
```
From: Amigo Invisible <onboarding@resend.dev>
To: estudiante@gmail.com
Subject: 🎁 Tu Amigo Invisible - 4º ESO A
```

**Después de migrar:**
```
From: Amigo Invisible <noreply@tuinstituto.edu>
To: estudiante@gmail.com  
Subject: 🎁 Tu Amigo Invisible - 4º ESO A
```

**Mismo email, más profesional.** ✨

---

¿Dudas? Lee `EMAIL_SETUP.md` para guía completa.
