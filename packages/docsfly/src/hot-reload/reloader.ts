'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';

export function HotReloader() {
  const router = useRouter();
  const pathname = usePathname();
  const eventSourceRef = useRef<EventSource | null>(null);

  // Restore scroll position on page load
  useEffect(() => {
    const savedPosition = sessionStorage.getItem(`scroll-${pathname}`);
    if (savedPosition) {
      const position = parseInt(savedPosition, 10);
      setTimeout(() => {
        window.scrollTo(0, position);
        sessionStorage.removeItem(`scroll-${pathname}`);
      }, 50);
    }
  }, [pathname]);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') {
      return;
    }
    
    // Connect to Server-Sent Events
    const eventSource = new EventSource('/api/docs-changes');
    eventSourceRef.current = eventSource;

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'docs-changed') {
          // Save current scroll position to sessionStorage
          const scrollPosition = window.scrollY;
          sessionStorage.setItem(`scroll-${pathname}`, scrollPosition.toString());
          
          // Refresh the page
          router.refresh();
        }
      } catch (error) {
        console.warn('Failed to parse SSE message:', error);
      }
    };

    eventSource.onerror = () => {
      console.warn('❌ SSE connection error');
    };

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, [router, pathname]);

  return null;
}