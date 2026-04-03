# Immersive Scrollytelling Experience

A premium, interactive landing page showcasing high-performance web animations, frame-by-frame scrollytelling, and sophisticated UI techniques. Originally conceived as a digital agency platform, it currently features a thematic tribute to Virat Kohli "The Chase Master" to demonstrate its cinematic capabilities.

## ✨ Features

- **Dual-Canvas Scrollytelling Engine**: 
  - Uses two synchronized HTML5 canvases rendering a massive image sequence (70 frames).
  - The `foreground-canvas` renders the sharp central frame using `object-fit: contain` and CSS `mask-image` for edge-blending.
  - The `ambient-canvas` acts as a dynamic cinematic backdrop, expanding the central image using `object-fit: cover` combined with heavy blur and saturation filters to eliminate standard "black bars."
- **GSAP & Lenis Integration**: 
  - Uses **Lenis** for buttery smooth, physics-based scrolling.
  - Tied to **GSAP ScrollTrigger**, tying frame rendering and staggered CSS character-reveal animations precisely to scroll progress.
- **Synchronized Comparison Slider**:
  - A custom-built vertical slider using JavaScript and CSS `clip-path` masks.
  - Draggable handle perfectly slices between a base layer and a top layer.
  - Features dynamic overlay masking: Floating glassmorphic stat cards are structurally bound to their respective layers, meaning they physically wipe in and out sequentially as the slider drags across the screen without relying on complex opacity fades.
- **Glassmorphism UI System**: 
  - Floating, animated interface cards utilizing heavy backdrop filters, transparency (`hsla`), and subtle shine streaks. 
  - Dynamic viewport calculations in JS to ensure text and UI bounds absolutely adhere to the painted image boundaries, regardless of aspect ratio or window resize.

## 🛠️ Tech Stack

- **HTML5** (Semantic structure)
- **CSS3** (Modern Vanilla CSS, Flexbox/Grid layouts, Glassmorphism offsets, Clip-paths)
- **JavaScript (Vanilla)** (Custom canvas loop, slider calculations, frame sequence buffering)
- **GSAP (GreenSock)** (Timeline animations, ScrollTrigger)
- **Lenis** (Smooth scroll hijacking)

## 📂 Project Structure

- `index.html`: The core semantic markup containing the split-text hero and the interactive comparison slider section.
- `style.css`: The comprehensive design system controlling everything from the frosted navbar down to the physics of the floating Glassmorphic cards.
- `script.js`: The brain of the operation. Houses the `ScrollExperience` class managing the Lenis scroll loop and canvas painting, as well as the event listener math bounding the slider and text overlays.
- `virat/`: Directory holding the 70 `.jpg` frames used during the hero scrollytelling sequence. 
- `viratleft.png` / `viratright.jpg`: Media assets utilized for the comparison slider.




