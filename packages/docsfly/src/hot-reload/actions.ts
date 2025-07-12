import { NextResponse } from "next/server";

// Store active SSE connections
const clients = new Set<ReadableStreamDefaultController>();

// Set up bridge for receiving notifications from docsfly package
if (typeof global !== 'undefined') {
  (global as any).__DOCSFLY_HOT_RELOAD_NOTIFY__ = () => {    
    const message = `data: ${JSON.stringify({ type: 'docs-changed', timestamp: Date.now() })}\n\n`;
    
    let successCount = 0;
    const deadClients = new Set();
    
    clients.forEach(controller => {
      try {
        controller.enqueue(message);
        successCount++;
      } catch (error) {
        deadClients.add(controller);
      }
    });
    
    deadClients.forEach(controller => clients.delete(controller as ReadableStreamDefaultController));
  };
}

export async function GET() {  // Server-Sent Events
  const stream = new ReadableStream({
    start(controller) {
      clients.add(controller);
      
      // Send initial connection event
      const message = `data: ${JSON.stringify({ type: 'connected' })}\n\n`;
      controller.enqueue(message);
      
      // Clean up when connection closes
      const cleanup = () => {
        clients.delete(controller);
      };
      
      // Store cleanup function for later use
      (controller as any).cleanup = cleanup;
    },
    cancel() {
      // Connection cancelled by client
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}

export async function POST() {  
  // Notify all connected clients
  const message = `data: ${JSON.stringify({ type: 'docs-changed', timestamp: Date.now() })}\n\n`;
  
  let successCount = 0;
  const deadClients = new Set();
  
  clients.forEach(controller => {
    try {
      controller.enqueue(message);
      successCount++;
    } catch (error) {
      console.warn('Dead SSE connection detected, removing...');
      deadClients.add(controller);
    }
  });
  
  // Clean up dead connections
  deadClients.forEach(controller => clients.delete(controller as ReadableStreamDefaultController));
  
  return NextResponse.json({ success: true, notified: successCount });
}