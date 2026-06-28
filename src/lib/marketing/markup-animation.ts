const JOIN_AS_PROVIDER_2_MARKUP_CURSOR_CLASS =
  "j2-cursor inline-block ml-0.5 h-[1em] w-[3px] bg-current align-[-2px]";

const JOIN_AS_PROVIDER_2_MARKUP_HIGHLIGHT_CLASS =
  "text-join-as-provider-2-highlight";

const JOIN_AS_PROVIDER_2_MARKUP_WORD_CLASS = "j2-word";

type MarkupSegment = {
  break?: boolean;
  text?: string;
  bold?: boolean;
  green?: boolean;
};

export function getMarkupCharCount(markup: string): number {
  return parseMarkup(markup).reduce((sum, seg) => {
    if (seg.break || !seg.text) return sum;
    return sum + seg.text.length;
  }, 0);
}

function parseMarkup(markup: string): MarkupSegment[] {
  const segments: MarkupSegment[] = [];

  markup.split("\n\n").forEach((para, pIdx) => {
    if (pIdx > 0) segments.push({ break: true });
    para.split("**").forEach((boldPart, bi) => {
      const bold = bi % 2 === 1;
      boldPart.split(/\{\{|\}\}/).forEach((part, ci) => {
        if (part.length) {
          segments.push({ text: part, bold, green: ci % 2 === 1 });
        }
      });
    });
  });

  return segments;
}

function createStyledNode(seg: {
  bold?: boolean;
  green?: boolean;
}): HTMLElement | Text {
  if (seg.bold) {
    const b = document.createElement("b");
    if (seg.green) b.classList.add(JOIN_AS_PROVIDER_2_MARKUP_HIGHLIGHT_CLASS);
    return b;
  }

  if (seg.green) {
    const s = document.createElement("span");
    s.classList.add(JOIN_AS_PROVIDER_2_MARKUP_HIGHLIGHT_CLASS);
    return s;
  }

  return document.createTextNode("");
}

function appendChar(node: HTMLElement | Text, char: string) {
  node.textContent = (node.textContent ?? "") + char;
}

function domAnchorValid(el: HTMLElement, cursor: HTMLSpanElement): boolean {
  return el.isConnected && cursor.parentNode === el;
}

export function typeMarkupAt(
  el: HTMLElement | null,
  markup: string,
  speed: number,
  isCancelled: () => boolean,
): Promise<void> {
  if (!el || !el.isConnected || isCancelled()) {
    return Promise.resolve();
  }

  const target = el;
  target.innerHTML = "";
  const cursor = document.createElement("span");
  cursor.className = JOIN_AS_PROVIDER_2_MARKUP_CURSOR_CLASS;
  target.appendChild(cursor);

  const segments = parseMarkup(markup);
  const state = {
    segIdx: 0,
    charIdx: 0,
    container: null as HTMLElement | Text | null,
  };

  let tid: number | null = null;

  const cleanup = () => {
    if (tid !== null) {
      clearTimeout(tid);
      tid = null;
    }
    if (cursor.parentNode === target) cursor.remove();
  };

  const canContinue = () => !isCancelled() && domAnchorValid(target, cursor);

  const schedule = (fn: () => void, delay = 0) => {
    if (tid !== null) clearTimeout(tid);
    tid = window.setTimeout(() => {
      tid = null;
      fn();
    }, delay);
  };

  return new Promise<void>((resolve) => {
    const finish = () => {
      cleanup();
      resolve();
    };

    function processCurrentSegment() {
      const seg = segments[state.segIdx];

      if (seg.break) {
        if (!advanceBreak(state, target, cursor)) {
          finish();
          return;
        }
        step();
        return;
      }

      if (!state.container) {
        state.container = initContainer(seg, target, cursor);
        if (!state.container) {
          finish();
          return;
        }
      }

      const hasTextLeft = seg.text ? state.charIdx < seg.text.length : false;
      if (hasTextLeft) {
        appendChar(state.container, seg.text![state.charIdx]);
        state.charIdx += 1;
        schedule(step, speed);
        return;
      }

      state.segIdx += 1;
      state.charIdx = 0;
      state.container = null;
      step();
    }

    function step() {
      if (!canContinue()) {
        finish();
        return;
      }
      if (state.segIdx >= segments.length) {
        finish();
        return;
      }
      processCurrentSegment();
    }

    step();
  });
}

function initContainer(
  seg: MarkupSegment,
  el: HTMLElement,
  cursor: HTMLSpanElement,
): HTMLElement | Text | null {
  if (!domAnchorValid(el, cursor)) return null;
  const node = createStyledNode(seg);
  if (node.nodeType === Node.TEXT_NODE) node.textContent = "";
  el.insertBefore(node, cursor);
  return node;
}

function advanceBreak(
  state: {
    segIdx: number;
    charIdx: number;
    container: HTMLElement | Text | null;
  },
  el: HTMLElement,
  cursor: HTMLSpanElement,
): boolean {
  if (!domAnchorValid(el, cursor)) return false;
  el.insertBefore(document.createElement("br"), cursor);
  el.insertBefore(document.createElement("br"), cursor);
  state.segIdx += 1;
  state.charIdx = 0;
  state.container = null;
  return true;
}

function renderSegmentTo(el: HTMLElement, seg: MarkupSegment) {
  if (seg.break) {
    el.appendChild(document.createElement("br"));
    el.appendChild(document.createElement("br"));
    return;
  }
  const node = createStyledNode(seg);
  node.textContent = seg.text ?? "";
  el.appendChild(node);
}

export function renderMarkupInstant(el: HTMLElement, markup: string) {
  el.innerHTML = "";
  parseMarkup(markup).forEach((seg) => renderSegmentTo(el, seg));
}

export function disintegrateMarkup(
  el: HTMLElement,
  markup: string,
  duration: number,
  isCancelled?: () => boolean,
): Promise<void> {
  if (!el.isConnected || isCancelled?.()) {
    return Promise.resolve();
  }

  const tokens: Array<{ text: string; green?: boolean }> = [];
  parseMarkup(markup).forEach((seg) => {
    if (seg.break || !seg.text) return;
    seg.text.split(/(\s+)/).forEach((word) => {
      if (word.length) {
        tokens.push({ text: word, green: seg.green });
      }
    });
  });

  el.innerHTML = "";
  const spans = tokens.map((tok) => {
    const s = document.createElement("span");
    s.className = JOIN_AS_PROVIDER_2_MARKUP_WORD_CLASS;
    if (tok.green) s.classList.add(JOIN_AS_PROVIDER_2_MARKUP_HIGHLIGHT_CLASS);
    s.textContent = tok.text;
    el.appendChild(s);
    el.appendChild(document.createTextNode(" "));
    return s;
  });

  requestAnimationFrame(() => {
    if (!el.isConnected || isCancelled?.()) return;
    spans.forEach((s, idx) => {
      const tx = (Math.random() * 2 - 1) * 240;
      const ty = -Math.random() * 170 - 30;
      const rot = (Math.random() * 2 - 1) * 55;
      s.style.transitionDelay = `${idx * 22}ms`;
      s.style.transform = `translate(${tx}px, ${ty}px) rotate(${rot}deg)`;
      s.classList.add("is-scattered");
    });
  });

  return new Promise<void>((resolve) => {
    window.setTimeout(() => resolve(), duration);
  });
}
