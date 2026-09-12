import { onDispose } from './cleanup.ts';

/** No polling, layout reads, animation loop or mutation observers. Theme CSS owns visibility. */
export function mountSignal({ signal }: { signal: AbortSignal }): () => void {
  if (signal.aborted || typeof document === 'undefined') return () => {};
  const layer = document.createElement('div');
  layer.className = 'bb-kujo-signal';
  layer.setAttribute('aria-hidden', 'true');
  layer.inert = true;
  // Inline display:none makes the node inert when another theme is selected.
  // Kujo's native stylesheet alone opts into display via !important.
  layer.style.display = 'none';
  const slice = document.createElement('span');
  layer.append(slice);
  const visibility = () => { layer.dataset.paused = String(document.hidden); };
  visibility();
  document.addEventListener('visibilitychange', visibility);
  document.body.append(layer);
  return onDispose(signal, () => {
    document.removeEventListener('visibilitychange', visibility);
    layer.remove();
  });
}
