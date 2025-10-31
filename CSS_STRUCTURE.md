# 📁 Estructura de Estilos CSS

## Archivos Globales (en `src/`)

### `index.css`
- Reset básico y estilos base
- Configuración de `html`, `body`, `#root`
- Gradiente de fondo global

### `dark-mode.css`
- Variables CSS para temas claro/oscuro
- Sistema de colores con `--bg-primary`, `--text-primary`, etc.
- Media query `@media (prefers-color-scheme: dark)`

### `dark-mode-overrides.css`
- Estilos específicos para `.dark-mode`
- Sobrescribe colores de inputs, tablas, modals
- Casos especiales (QR codes, emojis)

### `common-layouts.css` ⭐ NUEVO
- Layouts reutilizables (`.gradient-page`, `.white-container`)
- Animations comunes (`fadeIn`)
- Clases de tamaño (`.small`, `.medium`, `.large`)

### `mobile-adjustments.css` ⭐ NUEVO
- **Un único lugar** para todos los ajustes móviles
- Media query `@media (max-width: 768px)`
- Altura 105vh, padding reducido, etc.

### `landscape.css`
- Optimizaciones para orientación horizontal
- Media query `@media (orientation: landscape)`

## Archivos de Componentes (en `src/components/`)

Cada componente tiene su propio CSS con:
- Estilos específicos del componente
- **SIN media queries móviles** (están en `mobile-adjustments.css`)
- Estructura simple y fácil de editar

## 🎯 Ventajas de esta estructura:

1. **DRY (Don't Repeat Yourself)**: No duplicar media queries
2. **Single Source of Truth**: Cambios móviles en UN solo lugar
3. **Fácil mantenimiento**: Buscar estilos móviles → `mobile-adjustments.css`
4. **Modular**: Cada archivo tiene una responsabilidad clara

## 📝 Cómo editar estilos:

### Cambiar algo en móvil:
→ Editar `mobile-adjustments.css`

### Cambiar colores dark mode:
→ Editar `dark-mode.css` (variables) o `dark-mode-overrides.css` (overrides)

### Cambiar layout de una página:
→ Editar el CSS del componente específico

### Agregar un layout nuevo reutilizable:
→ Editar `common-layouts.css`
