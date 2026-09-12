/** Idempotent disposal shared by host teardown and abort. Removes its own listener. */
export function onDispose(signal: AbortSignal, release: () => void): () => void {
  let disposed = false;
  const dispose = () => {
    if (disposed) return;
    disposed = true;
    signal.removeEventListener('abort', dispose);
    release();
  };
  if (signal.aborted) dispose();
  else signal.addEventListener('abort', dispose, { once: true });
  return dispose;
}
