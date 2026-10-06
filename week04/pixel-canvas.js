class PixelCanvas extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          position: relative;
          isolation: isolate;
        }
        canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 0;
        }
        slot {
          display: block;
        }
        ::slotted(*) {
          position: relative;
          z-index: 1;
        }
      </style>
      <canvas aria-hidden="true"></canvas>
      <slot></slot>
    `;
    this.pixels = new Map();
    this.drawFrame = this.drawFrame.bind(this);
    this.handlePointerMove = this.handlePointerMove.bind(this);
  }

  connectedCallback() {
    this.canvas = this.shadowRoot.querySelector("canvas");
    this.context = this.canvas.getContext("2d");
    this.resizeCanvas();
    this.resizeObserver = new ResizeObserver(() => this.resizeCanvas());
    this.resizeObserver.observe(this);
    this.addEventListener("pointermove", this.handlePointerMove);
  }

  disconnectedCallback() {
    this.resizeObserver?.disconnect();
    this.removeEventListener("pointermove", this.handlePointerMove);
    cancelAnimationFrame(this.animationFrame);
  }

  resizeCanvas() {
    const bounds = this.getBoundingClientRect();
    const pixelRatio = window.devicePixelRatio || 1;
    this.canvas.width = Math.ceil(bounds.width * pixelRatio);
    this.canvas.height = Math.ceil(bounds.height * pixelRatio);
    this.context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    this.pixels.clear();
  }

  handlePointerMove(event) {
    const bounds = this.getBoundingClientRect();
    const gap = Math.max(2, Number(this.dataset.gap) || 10);
    const centerX = Math.floor((event.clientX - bounds.left) / gap);
    const centerY = Math.floor((event.clientY - bounds.top) / gap);

    for (let y = centerY - 2; y <= centerY + 2; y++) {
      for (let x = centerX - 2; x <= centerX + 2; x++) {
        if (Math.random() < 0.7) {
          this.pixels.set(`${x},${y}`, { x, y, life: 1 });
        }
      }
    }

    if (!this.animationFrame) {
      this.animationFrame = requestAnimationFrame(this.drawFrame);
    }
  }

  drawFrame() {
    this.animationFrame = 0;
    const bounds = this.getBoundingClientRect();
    const gap = Math.max(2, Number(this.dataset.gap) || 10);
    const decay = 1 / Math.max(10, Number(this.dataset.speed) || 25);
    const colors = (this.dataset.colors || "#0ea5e9")
      .split(",")
      .map((color) => color.trim())
      .filter(Boolean);

    this.context.clearRect(0, 0, bounds.width, bounds.height);

    for (const [key, pixel] of this.pixels) {
      pixel.life -= decay;
      if (pixel.life <= 0) {
        this.pixels.delete(key);
        continue;
      }

      const colorIndex = Math.abs(pixel.x * 7 + pixel.y * 13) % colors.length;
      this.context.globalAlpha = pixel.life * 0.8;
      this.context.fillStyle = colors[colorIndex];
      this.context.fillRect(pixel.x * gap, pixel.y * gap, gap - 1, gap - 1);
    }

    this.context.globalAlpha = 1;
    if (this.pixels.size > 0) {
      this.animationFrame = requestAnimationFrame(this.drawFrame);
    }
  }
}

customElements.define("pixel-canvas", PixelCanvas);
