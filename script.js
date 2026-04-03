class ScrollExperience {
  constructor() {
    this.initLenis();
    this.initText();
    this.initCanvasEngine();
  }

  initLenis() {
    this.lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    const raf = (time) => {
      this.lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }

  initText() {
    const textElements = document.querySelectorAll('.animated-text');
    
    textElements.forEach(textElement => {
      const text = textElement.innerText;
      textElement.innerHTML = '';
  
      const words = text.split(' ');
      words.forEach((word) => {
        const wordSpan = document.createElement('span');
        wordSpan.classList.add('word');
  
        word.split('').forEach(char => {
          const charSpan = document.createElement('span');
          charSpan.classList.add('char');
          charSpan.innerText = char;
          wordSpan.appendChild(charSpan);
        });
  
        textElement.appendChild(wordSpan);
      });
    });
  }

  initCanvasEngine() {
    gsap.registerPlugin(ScrollTrigger);

    this.ambientCanvas = document.getElementById("ambient-canvas");
    this.ambientCtx = this.ambientCanvas.getContext("2d");

    this.fgCanvas = document.getElementById("foreground-canvas");
    this.fgCtx = this.fgCanvas.getContext("2d");
    
    this.textOverlay = document.querySelector('.text-overlay');

    this.frameCount = 70; // index from 011 to 080
    this.currentFrame = index => `./virat/ezgif-frame-${(index + 11).toString().padStart(3, '0')}.jpg`;

    this.images = [];
    this.imageSequence = { frame: 0 };
    
    this.updateTextBounds = () => {
        if (!this.images[0]) return;
        const img = this.images[0];
        const windowRatio = window.innerWidth / window.innerHeight;
        const imgRatio = img.width / img.height;
        let renderWidth, renderHeight;
        if (windowRatio > imgRatio) { // Screen is wider than image (pillarbox - sides are blurred)
            renderHeight = window.innerHeight;
            renderWidth = renderHeight * imgRatio;
        } else { // Screen is taller than image (letterbox - top/bottom are blurred)
            renderWidth = window.innerWidth;
            renderHeight = renderWidth / imgRatio;
        }
        if (this.textOverlay) {
            this.textOverlay.style.width = renderWidth + 'px';
            this.textOverlay.style.height = renderHeight + 'px';
        }
    };
    
    window.addEventListener("resize", this.updateTextBounds);

    let loadedCount = 0;
    for (let i = 0; i < this.frameCount; i++) {
      const img = new Image();
      img.onload = () => {
        loadedCount++;
        if (loadedCount === 1) {
          this.updateTextBounds();
          this.render(); // initial setup when first image loads
        }
      };
      img.src = this.currentFrame(i);
      this.images.push(img);
    }

    this.setupTimeline();
  }

  render() {
    if (!this.images[this.imageSequence.frame]) return;

    const img = this.images[this.imageSequence.frame];

    // By setting the canvas dimensions to match the intrinsic image dimensions exactly,
    // we can utilize CSS object-fit (cover for ambient, contain for foreground)
    // to handle all responsiveness and aspect-ratio scaling cleanly via the GPU!
    if (this.ambientCanvas.width !== img.width) {
      this.ambientCanvas.width = img.width;
      this.ambientCanvas.height = img.height;
      this.fgCanvas.width = img.width;
      this.fgCanvas.height = img.height;
    }

    // Draw natively without calculating offsets
    this.ambientCtx.drawImage(img, 0, 0);
    this.fgCtx.drawImage(img, 0, 0);
  }

  setupTimeline() {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".canvas-container",
        pin: true,
        start: "top top",
        end: "+=1000%", // Scroll distance of 15x viewport height to guarantee extreme slowness
        scrub: 1, // Slight scrub to smooth wheel events out
      }
    });

    // Use arbitrary proportional units for timeline length
    const timeLimit = 100;

    tl.to(this.imageSequence, {
      frame: this.frameCount - 1,
      snap: "frame",
      ease: "none",
      onUpdate: () => this.render(),
      duration: timeLimit
    }, 0);

    const chars = document.querySelectorAll('.char');
    tl.to(chars, {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      stagger: (timeLimit * 0.8) / chars.length, // Stagger chars evenly across 80% of the scroll
      ease: "power2.out",
      duration: timeLimit * 0.2, // Each character takes 20% of the scroll to finish animating
    }, 0);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new ScrollExperience();
  initComparisonSlider();
});

function initComparisonSlider() {
  const slider    = document.getElementById('comparisonSlider');
  const leftWrap  = document.getElementById('compareLeftWrap');
  const handle    = document.getElementById('compareHandle');

  if (!slider || !leftWrap || !handle) return;

  let isDragging = false;

  function setPosition(clientX) {
    const rect = slider.getBoundingClientRect();
    // Clamp x to slider bounds
    let x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const pct = (x / rect.width) * 100;

    // Clip the left image overlay to the drag position
    leftWrap.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;

    // Move the handle line
    handle.style.left  = pct + '%';
    handle.style.transform = 'translateX(-50%)';
  }

  // ── Mouse events ──────────────────────────────────────────
  slider.addEventListener('mousedown', (e) => {
    isDragging = true;
    slider.style.cursor = 'col-resize';
    setPosition(e.clientX);
    e.preventDefault();
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    setPosition(e.clientX);
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
    slider.style.cursor = 'col-resize';
  });

  // ── Touch events ──────────────────────────────────────────
  slider.addEventListener('touchstart', (e) => {
    isDragging = true;
    setPosition(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    setPosition(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });
}
