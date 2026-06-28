export class PausedFlowTimer {
  private flowToken = 0;
  private destroyed = false;
  private pTimer = {
    id: null as number | null,
    callback: null as (() => void) | null,
    remaining: 0,
    startedAt: 0,
    active: false,
  };

  public markDestroyed() {
    this.destroyed = true;
  }

  public isDestroyed() {
    return this.destroyed;
  }

  public stopAll() {
    this.flowToken += 1;
    if (this.pTimer.id !== null) clearTimeout(this.pTimer.id);
    this.pTimer.id = null;
    this.pTimer.callback = null;
    this.pTimer.active = false;
    return this.flowToken;
  }

  public getFlowToken() {
    return this.flowToken;
  }

  public guard(token: number, fn: () => void) {
    return () => {
      if (token !== this.flowToken || this.destroyed) return;
      fn();
    };
  }

  public schedule(callback: () => void, delay: number) {
    this.pTimer.callback = callback;
    this.pTimer.remaining = delay;
    this.pTimer.startedAt = Date.now();
    this.pTimer.active = true;
    this.pTimer.id = window.setTimeout(() => {
      this.pTimer.active = false;
      const cb = this.pTimer.callback;
      this.pTimer.callback = null;
      cb?.();
    }, delay);
  }

  public pause() {
    if (!this.pTimer.active || this.pTimer.id === null) return;

    clearTimeout(this.pTimer.id);
    this.pTimer.id = null;
    const elapsed = Date.now() - this.pTimer.startedAt;
    this.pTimer.remaining = Math.max(0, this.pTimer.remaining - elapsed);
  }

  public resume() {
    if (!this.pTimer.active || !this.pTimer.callback) return;
    this.schedule(this.pTimer.callback, this.pTimer.remaining);
  }
}
