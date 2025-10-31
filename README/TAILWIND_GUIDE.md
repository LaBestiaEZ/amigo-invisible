# 🎨 Tailwind CSS - Guía Rápida

## ✅ Configuración Completa

Hemos migrado de CSS custom a **Tailwind CSS** para una mejor mantenibilidad.

## 📁 Estructura

```
src/
  └── index.css     # Solo Tailwind directives + componentes custom mínimos
tailwind.config.js  # Configuración de Tailwind
postcss.config.js   # PostCSS para procesar Tailwind
```

## 🎨 Clases Personalizadas

### Layouts
- `.gradient-page` - Página con gradiente y centrado
- `.card-white` - Tarjeta blanca con sombra (dark mode ready)

### Botones
- `.btn-primary` - Botón morado principal
- `.btn-secondary` - Botón morado secundario  
- `.btn-danger` - Botón rojo
- `.btn-success` - Botón verde

### Inputs
- `.input-field` - Campo de entrada estilizado

### Utilidades
- `.safe-area-padding` - Padding con safe areas para iOS
- `.animate-fade-in` - Animación de fade in

## 🎯 Colores Personalizados

```js
primary: '#667eea'    // Morado principal
secondary: '#764ba2'   // Morado secundario
```

## 📱 Dark Mode

Tailwind está configurado con `darkMode: 'class'`

```jsx
// Agregar/quitar clase 'dark' en html
document.documentElement.classList.toggle('dark')
```

## 🍎 iOS Safe Areas

Usa la clase `.safe-area-padding` o usa Tailwind normal:

```jsx
<div className="p-5 md:safe-area-padding">
  {/* contenido */}
</div>
```

## 📚 Recursos

- [Tailwind Docs](https://tailwindcss.com/docs)
- [Tailwind Play](https://play.tailwindcss.com/) - Testing online
