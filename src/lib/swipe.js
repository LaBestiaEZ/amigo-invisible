// ============================================
// 🔄 GESTOS SWIPE PARA MÓVIL
// ============================================

export class SwipeDetector {
  constructor(element, options = {}) {
    this.element = element;
    this.startX = 0;
    this.startY = 0;
    this.distX = 0;
    this.distY = 0;
    this.threshold = options.threshold || 50; // Mínimo 50px para activar
    this.restraint = options.restraint || 100; // Máxima distancia vertical
    this.allowedTime = options.allowedTime || 300; // Máximo 300ms
    this.startTime = 0;

    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);

    this.init();
  }

  init() {
    this.element.addEventListener('touchstart', this.handleTouchStart, { passive: true });
    this.element.addEventListener('touchmove', this.handleTouchMove, { passive: false });
    this.element.addEventListener('touchend', this.handleTouchEnd, { passive: true });
  }

  handleTouchStart(e) {
    const touchobj = e.changedTouches[0];
    this.distX = 0;
    this.distY = 0;
    this.startX = touchobj.pageX;
    this.startY = touchobj.pageY;
    this.startTime = new Date().getTime();
  }

  handleTouchMove(e) {
    // Prevenir scroll si es swipe horizontal
    const touchobj = e.changedTouches[0];
    this.distX = touchobj.pageX - this.startX;
    this.distY = touchobj.pageY - this.startY;

    if (Math.abs(this.distX) > Math.abs(this.distY)) {
      e.preventDefault();
    }
  }

  handleTouchEnd(e) {
    const touchobj = e.changedTouches[0];
    this.distX = touchobj.pageX - this.startX;
    this.distY = touchobj.pageY - this.startY;
    const elapsedTime = new Date().getTime() - this.startTime;

    // Swipe derecha
    if (
      elapsedTime <= this.allowedTime &&
      this.distX >= this.threshold &&
      Math.abs(this.distY) <= this.restraint
    ) {
      this.onSwipeRight && this.onSwipeRight();
    }
    // Swipe izquierda
    else if (
      elapsedTime <= this.allowedTime &&
      this.distX <= -this.threshold &&
      Math.abs(this.distY) <= this.restraint
    ) {
      this.onSwipeLeft && this.onSwipeLeft();
    }
    // Swipe arriba
    else if (
      elapsedTime <= this.allowedTime &&
      this.distY <= -this.threshold &&
      Math.abs(this.distX) <= this.restraint
    ) {
      this.onSwipeUp && this.onSwipeUp();
    }
    // Swipe abajo
    else if (
      elapsedTime <= this.allowedTime &&
      this.distY >= this.threshold &&
      Math.abs(this.distX) <= this.restraint
    ) {
      this.onSwipeDown && this.onSwipeDown();
    }
  }

  destroy() {
    this.element.removeEventListener('touchstart', this.handleTouchStart);
    this.element.removeEventListener('touchmove', this.handleTouchMove);
    this.element.removeEventListener('touchend', this.handleTouchEnd);
  }
}

// Uso en componentes:
// import { SwipeDetector } from './lib/swipe'
// 
// const swipe = new SwipeDetector(elementRef.current)
// swipe.onSwipeLeft = () => console.log('Swipe left!')
// swipe.onSwipeRight = () => console.log('Swipe right!')
// swipe.onSwipeUp = () => console.log('Swipe up!')
// swipe.onSwipeDown = () => console.log('Swipe down!')
