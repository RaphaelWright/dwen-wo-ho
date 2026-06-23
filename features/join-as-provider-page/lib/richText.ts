// ─── Markup syntax ────────────────────────────────────────────────────────────
// **bold**         → <b>
// {{green text}}   → <span style="color:#2bb673">
// \n\n             → paragraph break (two <br>s when typing)

export interface TextSegment {
  text: string;
  bold?: boolean;
  green?: boolean;
}

export interface BreakSegment {
  break: true;
}

export type Segment = TextSegment | BreakSegment;

export function parseMarkup(markup: string): Segment[] {
  const segments: Segment[] = [];

  markup.split("\n\n").forEach((para, pIdx) => {
    if (pIdx > 0) segments.push({ break: true });

    para.split("**").forEach((boldPart, bi) => {
      const bold = bi % 2 === 1;

      let green = false;
      let buffer = "";

      for (let i = 0; i < boldPart.length; i++) {
        if (boldPart.slice(i, i + 2) === "{{") {
          if (buffer) {
            segments.push({ text: buffer, bold, green });
            buffer = "";
          }
          green = true;
          i++;
          continue;
        }

        if (boldPart.slice(i, i + 2) === "}}") {
          if (buffer) {
            segments.push({ text: buffer, bold, green });
            buffer = "";
          }
          green = false;
          i++;
          continue;
        }

        buffer += boldPart[i];
      }

      if (buffer) {
        segments.push({ text: buffer, bold, green });
      }
    });
  });

  return segments;
}

// Total printable character count across all segments
export function countChars(segments: Segment[]): number {
  return segments.reduce(
    (sum, s) => sum + ("text" in s ? s.text.length : 0),
    0,
  );
}

// ─── DOM helpers used by the hook ────────────────────────────────────────────

function makeNode(seg: TextSegment): HTMLElement {
  if (seg.bold) {
    const b = document.createElement("b");
    if (seg.green) b.style.color = "#2bb673";
    return b;
  }
  if (seg.green) {
    const s = document.createElement("span");
    s.style.color = "#2bb673";
    return s;
  }
  // Always return an element (never a bare Text node) so .textContent += works reliably
  return document.createElement("span");
}

// Types segments character-by-character into `el` at `msPerChar` speed.
// A cursor span is prepended and removed when done.
// Returns a cancel function.
export function typeIntoEl(
  el: HTMLElement,
  segments: Segment[],
  msPerChar: number,
  onDone?: () => void,
): () => void {
  el.innerHTML = "";
  const cursor = document.createElement("span");
  cursor.className = "prov-cursor";
  el.appendChild(cursor);

  let segIdx = 0;
  let charIdx = 0;
  let container: HTMLElement | null = null;
  let tid: ReturnType<typeof setTimeout> | null = null;
  let cancelled = false;

  function step() {
    if (cancelled) return;
    if (segIdx >= segments.length) {
      cursor.remove();
      onDone?.();
      return;
    }
    const seg = segments[segIdx];
    if ("break" in seg) {
      el.insertBefore(document.createElement("br"), cursor);
      el.insertBefore(document.createElement("br"), cursor);
      segIdx++;
      charIdx = 0;
      step();
      return;
    }
    if (charIdx === 0) {
      container = makeNode(seg as TextSegment);
      el.insertBefore(container, cursor);
    }
    if (charIdx < (seg as TextSegment).text.length) {
      container!.textContent += (seg as TextSegment).text[charIdx];
      charIdx++;
      tid = setTimeout(step, msPerChar);
    } else {
      segIdx++;
      charIdx = 0;
      step();
    }
  }

  step();
  return () => {
    cancelled = true;
    if (tid !== null) clearTimeout(tid);
  };
}

// Types with auto-speed so the whole thing takes ~totalMs
export function typeIntoElTimed(
  el: HTMLElement,
  segments: Segment[],
  totalMs: number,
  onDone?: () => void,
): () => void {
  const total = countChars(segments);
  const speed = Math.max(8, totalMs / Math.max(1, total));
  return typeIntoEl(el, segments, speed, onDone);
}

// Renders all markup instantly (reduced-motion fallback)
export function renderInstant(el: HTMLElement, markup: string): void {
  el.innerHTML = "";
  parseMarkup(markup).forEach((seg) => {
    if ("break" in seg) {
      el.appendChild(document.createElement("br"));
      el.appendChild(document.createElement("br"));
      return;
    }
    const node = makeNode(seg as TextSegment);
    node.textContent = (seg as TextSegment).text;
    el.appendChild(node);
  });
}

// Scatters words out of `el` over `durationMs`, then clears the element
export function disintegrate(
  el: HTMLElement,
  markup: string,
  durationMs: number,
): Promise<void> {
  return new Promise((resolve) => {
    const tokens: { text: string; green?: boolean }[] = [];
    parseMarkup(markup).forEach((seg) => {
      if ("break" in seg) return;
      (seg as TextSegment).text.split(" ").forEach((w) => {
        if (w.length)
          tokens.push({ text: w, green: (seg as TextSegment).green });
      });
    });

    el.innerHTML = "";
    const spans = tokens.map((tok) => {
      const s = document.createElement("span");
      s.className = "prov-word";
      if (tok.green) s.style.color = "#2bb673";
      s.textContent = tok.text;
      el.appendChild(s);
      el.appendChild(document.createTextNode(" "));
      return s;
    });

    requestAnimationFrame(() => {
      spans.forEach((s, idx) => {
        const tx = (Math.random() * 2 - 1) * 240;
        const ty = -Math.random() * 170 - 30;
        const rot = (Math.random() * 2 - 1) * 55;
        s.style.transitionDelay = `${idx * 22}ms`;
        s.style.transform = `translate(${tx}px, ${ty}px) rotate(${rot}deg)`;
        s.classList.add("prov-scatter");
      });
    });

    setTimeout(() => {
      el.innerHTML = "";
      resolve();
    }, durationMs);
  });
}
