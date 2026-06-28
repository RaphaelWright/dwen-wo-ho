export function typeText(
  el: HTMLElement | null,
  text: string,
  speed: number,
  onDone: (() => void) | undefined,
  token: number,
  getToken: () => number,
): void {
  if (!el) return;
  const target = el;
  target.textContent = "";
  let i = 0;

  function step() {
    if (!target.isConnected || token !== getToken()) return;
    if (i < text.length) {
      target.textContent += text.charAt(i);
      i += 1;
      window.setTimeout(step, speed);
    } else if (onDone) {
      onDone();
    }
  }

  step();
}
