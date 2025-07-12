// Bridge for communicating between file watcher and Next.js API routes
type NotifyFunction = () => void;

// Global storage for notification callbacks
const globalKey = '__DOCSFLY_HOT_RELOAD_NOTIFY__';

declare global {
  var __DOCSFLY_HOT_RELOAD_NOTIFY__: NotifyFunction | undefined;
}

export function setNotifyCallback(callback: NotifyFunction) {
  (global as any)[globalKey] = callback;
}

export function getNotifyCallback(): NotifyFunction | undefined {
  return (global as any)[globalKey];
}

export function notifyChange() {
  const callback = getNotifyCallback();
  if (callback) {
    callback();
  }
}