const PL2_MARKUP_CURSOR_CLASS =
  "pl2-cursor inline-block ml-0.5 h-[1em] w-[3px] bg-current align-[-2px]";

const PL2_MARKUP_HIGHLIGHT_CLASS = "text-(--provider-launch-highlight)";

const PL2_MARKUP_WORD_CLASS = "pl2-word";

type MarkupSegment = {
  break?: boolean;
  text?: string;
  bold?: boolean;
  green?: boolean;
};

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
    if (seg.green) b.classList.add(PL2_MARKUP_HIGHLIGHT_CLASS);
    return b;
  }

  if (seg.green) {
    const s = document.createElement("span");
    s.classList.add(PL2_MARKUP_HIGHLIGHT_CLASS);
    return s;
  }

  return document.createTextNode("");
}

function appendChar(node: HTMLElement | Text, char: string) {
  node.textContent = (node.textContent ?? "") + char;
}

function initContainer(
  seg: MarkupSegment,
  el: HTMLElement,
  cursor: HTMLSpanElement,
): HTMLElement | Text {
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
) {
  el.insertBefore(document.createElement("br"), cursor);
  el.insertBefore(document.createElement("br"), cursor);
  state.segIdx += 1;
  state.charIdx = 0;
  state.container = null;
}

function isTypingDone(
  state: { segIdx: number },
  segments: MarkupSegment[],
  isCancelled: () => boolean,
) {
  if (isCancelled()) return true;
  return state.segIdx >= segments.length;
}

function handleTextSegment(
  seg: MarkupSegment,
  state: {
    segIdx: number;
    charIdx: number;
    container: HTMLElement | Text | null;
  },
  el: HTMLElement,
  cursor: HTMLSpanElement,
  speed: number,
  stepFn: () => void,
) {
  if (!state.container) {
    state.container = initContainer(seg, el, cursor);
  }
  const hasTextLeft = seg.text ? state.charIdx < seg.text.length : false;
  if (hasTextLeft) {
    appendChar(state.container, seg.text![state.charIdx]);
    state.charIdx += 1;
    window.setTimeout(stepFn, speed);
  } else {
    state.segIdx += 1;
    state.charIdx = 0;
    state.container = null;
    stepFn();
  }
}

function processMarkupSegment(
  seg: MarkupSegment,
  state: {
    segIdx: number;
    charIdx: number;
    container: HTMLElement | Text | null;
  },
  el: HTMLElement,
  cursor: HTMLSpanElement,
  speed: number,
  stepFn: () => void,
) {
  if (seg.break) {
    advanceBreak(state, el, cursor);
    stepFn();
    return;
  }
  handleTextSegment(seg, state, el, cursor, speed, stepFn);
}

export function typeMarkupAt(
  el: HTMLElement,
  markup: string,
  speed: number,
  isCancelled: () => boolean,
): Promise<void> {
  el.innerHTML = "";
  const cursor = document.createElement("span");
  cursor.className = PL2_MARKUP_CURSOR_CLASS;
  el.appendChild(cursor);

  const segments = parseMarkup(markup);
  const state = {
    segIdx: 0,
    charIdx: 0,
    container: null as HTMLElement | Text | null,
  };

  return new Promise<void>((resolve) => {
    function step() {
      if (isTypingDone(state, segments, isCancelled)) {
        cursor.remove();
        resolve();
        return;
      }
      processMarkupSegment(
        segments[state.segIdx],
        state,
        el,
        cursor,
        speed,
        step,
      );
    }

    step();
  });
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
): Promise<void> {
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
    s.className = PL2_MARKUP_WORD_CLASS;
    if (tok.green) s.classList.add(PL2_MARKUP_HIGHLIGHT_CLASS);
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
      s.classList.add("is-scattered");
    });
  });

  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, duration);
  });
}
