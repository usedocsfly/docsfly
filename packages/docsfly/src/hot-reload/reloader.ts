'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export function HotReloader() {
  const router = useRouter();
  const eventSourceRef = useRef<EventSource | null>(null);

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
        if (data.type === 'connected') {
        } else if (data.type === 'docs-changed') {
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
  }, [router]);

  return null;
}