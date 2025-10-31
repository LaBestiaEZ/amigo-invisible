// ============================================
// 📳 HAPTIC FEEDBACK PARA iOS/ANDROID
// ============================================

export const HapticFeedback = {
  // Vibración ligera (click suave)
  light: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
    // iOS Taptic Engine
    if (window.Taptic && window.Taptic.impact) {
      window.Taptic.impact({ style: 'light' });
    }
  },

  // Vibración media (click normal)
  medium: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(20);
    }
    if (window.Taptic && window.Taptic.impact) {
      window.Taptic.impact({ style: 'medium' });
    }
  },

  // Vibración fuerte (acción importante)
  heavy: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(30);
    }
    if (window.Taptic && window.Taptic.impact) {
      window.Taptic.impact({ style: 'heavy' });
    }
  },

  // Feedback de éxito
  success: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([10, 30, 10]);
    }
    if (window.Taptic && window.Taptic.notification) {
      window.Taptic.notification({ type: 'success' });
    }
  },

  // Feedback de error
  error: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([30, 50, 30]);
    }
    if (window.Taptic && window.Taptic.notification) {
      window.Taptic.notification({ type: 'error' });
    }
  },

  // Feedback de advertencia
  warning: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([20, 40, 20]);
    }
    if (window.Taptic && window.Taptic.notification) {
      window.Taptic.notification({ type: 'warning' });
    }
  },

  // Vibración de selección (cambio de tab, slider, etc)
  selection: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(5);
    }
    if (window.Taptic && window.Taptic.selection) {
      window.Taptic.selection();
    }
  }
};

// Uso en componentes:
// import { HapticFeedback } from './lib/haptic'
// 
// onClick={() => {
//   HapticFeedback.light()
//   // ... tu código
// }}
//
// onSuccess={() => {
//   HapticFeedback.success()
//   // ... tu código
// }}
