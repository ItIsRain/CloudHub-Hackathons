import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Creates an optimized data URL for a tiny placeholder image
 * @param width Width of the image
 * @param height Height of the image
 * @param color Background color (hex format without #)
 * @returns Data URL for the tiny placeholder
 */
export function createPlaceholderURL(width: number, height: number, color: string = "e5e7eb") {
  return `data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${width} ${height}'%3E%3Crect width='${width}' height='${height}' fill='%23${color}'/%3E%3C/svg%3E`
}

/**
 * Lightweight throttle function to limit the rate of function calls 
 */
export function throttle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => ReturnType<T> | undefined {
  let lastCall = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall < delay) {
      return;
    }
    lastCall = now;
    return callback(...args);
  };
}

/**
 * Lazy load images with IntersectionObserver
 * @param element Element to observe
 * @param callback Callback to run when element is visible
 */
export function lazyLoadElement(
  element: HTMLElement | null,
  callback: () => void,
  options: IntersectionObserverInit = { rootMargin: '200px' }
): () => void {
  if (!element || typeof IntersectionObserver === 'undefined') {
    // If browser doesn't support IntersectionObserver, call callback immediately
    callback();
    return () => {};
  }

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      callback();
      observer.disconnect();
    }
  }, options);

  observer.observe(element);
  
  return () => {
    observer.disconnect();
  };
}

/**
 * Optimized event handler that uses requestAnimationFrame for smoother animations
 */
export function rafHandler<T extends (...args: any[]) => any>(
  callback: T
): (...args: Parameters<T>) => void {
  let ticking = false;
  return (...args: Parameters<T>) => {
    if (!ticking) {
      requestAnimationFrame(() => {
        callback(...args);
        ticking = false;
      });
      ticking = true;
    }
  };
}

/**
 * Load a script dynamically with performance optimizations
 */
export function loadScript(
  src: string,
  async: boolean = true,
  defer: boolean = true
): Promise<HTMLScriptElement> {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = async;
    script.defer = defer;
    
    script.onload = () => resolve(script);
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    
    document.head.appendChild(script);
  });
}
