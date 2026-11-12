// One shared pointer. The cursor and the sky both read from here.
export const pointer = { x: -1, y: -1, vx: 0, vy: 0, t: 0, seen: false, down: false, fine: false };

if (typeof window !== 'undefined') {
  pointer.fine = matchMedia('(pointer: fine)').matches;
  addEventListener('pointermove', (e) => {
    pointer.vx = e.clientX - pointer.x; pointer.vy = e.clientY - pointer.y;
    pointer.x = e.clientX; pointer.y = e.clientY;
    pointer.t = performance.now(); pointer.seen = true;
    if (e.pointerType) pointer.fine = e.pointerType === 'mouse' || e.pointerType === 'pen';
  }, { passive: true });
  addEventListener('pointerdown', () => { pointer.down = true; }, { passive: true });
  addEventListener('pointerup', () => { pointer.down = false; }, { passive: true });
}
