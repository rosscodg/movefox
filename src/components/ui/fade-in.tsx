'use client';

import { useRef, useEffect, useState, type ReactNode } from 'react';

// Shared IntersectionObserver for all FadeIn instances — avoids creating
// dozens of individual observers on pages with many animated sections.
const callbacks = new Map<Element, (visible: boolean) => void>();
let sharedObserver: IntersectionObserver | null = null;

function getObserver() {
  if (sharedObserver) return sharedObserver;
  sharedObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const cb = callbacks.get(entry.target);
        if (cb) cb(entry.isIntersecting);
      }
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' },
  );
  return sharedObserver;
}

interface FadeInProps {
  children: ReactNode;
  className?: string;
  /** Delay in ms before the animation starts (useful for staggering) */
  delay?: number;
  /** Direction the element slides from */
  direction?: 'up' | 'none';
  /** Duration in ms */
  duration?: number;
  /** Only animate once (default true) */
  once?: boolean;
}

export function FadeIn({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  duration = 400,
  once = true,
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = getObserver();

    callbacks.set(el, (visible) => {
      if (visible) {
        setIsVisible(true);
        if (once) {
          observer.unobserve(el);
          callbacks.delete(el);
        }
      } else if (!once) {
        setIsVisible(false);
      }
    });

    observer.observe(el);
    return () => {
      observer.unobserve(el);
      callbacks.delete(el);
    };
  }, [once]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        translate: isVisible ? 'none' : direction === 'up' ? '0 16px' : 'none',
        transition: `opacity ${duration}ms ease-out ${delay}ms, translate ${duration}ms ease-out ${delay}ms`,
        willChange: isVisible ? 'auto' : 'opacity, translate',
      }}
    >
      {children}
    </div>
  );
}
