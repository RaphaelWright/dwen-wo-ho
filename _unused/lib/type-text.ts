export function typeText(
  el: HTMLElement,
  text: string,
  speed: number,
  onDone: (() => void) | undefined,
  token: number,
  getToken: () => number,
): void {
  el.textContent = "";
  let i = 0;

  function step() {
    if (token !== getToken()) return;
    if (i < text.length) {
      el.textContent += text.charAt(i);
      i += 1;
      window.setTimeout(step, speed);
    } else if (onDone) {
      onDone();
    }
  }

  step();
}
