# 🌌 Shaik Hafiz — 3D Interactive Portfolio (V1)

<div align="center">

  [![Live Demo](https://img.shields.io/badge/LIVE%20DEMO-VISIT%20SITE-00F2FE?style=for-the-badge&logo=googlechrome&logoColor=black)](https://hafizsk100200.github.io/3d-portfolio-v1/)
  [![GitHub stars](https://img.shields.io/github/stars/Hafizsk100200/3d-portfolio-v1?style=for-the-badge&color=ffd700)](https://github.com/Hafizsk100200/3d-portfolio-v1/stargazers)
  [![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

  <br />

  [![React](https://img.shields.io/badge/React_18-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://reactjs.org/)
  [![Three.js](https://img.shields.io/badge/Three.js-000000?style=flat-square&logo=three.js&logoColor=white)](https://threejs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=flat-square&logo=greensock&logoColor=white)](https://greensock.com/)

  <p align="center">
    <b>A state-of-the-art, high-performance 3D developer portfolio featuring procedural WebGL shaders, interactive GLTF chromium mesh rendering, dynamic scroll-synchronized physics, and kinetic typography.</b>
  </p>

  <p align="center">
    <a href="https://hafizsk100200.github.io/3d-portfolio-v1/"><strong>Explore the Live Experience »</strong></a>
    <br />
    <br />
    <a href="#-key-features">Key Features</a>
    ·
    <a href="#-tech-stack">Tech Stack</a>
    ·
    <a href="#-quick-start">Getting Started</a>
    ·
    <a href="#-project-structure">Architecture</a>
    ·
    <a href="#-about-the-developer">Author</a>
  </p>

</div>

---

## ⚡ Overview

**3D Portfolio V1** is an award-winning creative developer showcase engineered by **Shaik Hafiz**. Designed around the concept of fluid WebGL interactions and dark minimalism, the portfolio seamlessly marries 3D geometry manipulation with responsive modern web standards.

Every interaction—from the custom intro loader to the scroll-linked chromium head deformation and inertia-based smooth page scrolling—has been tailored to provide a silky smooth **60 FPS** user experience across both desktop and mobile devices.

> 🔗 **Live URL:** [https://hafizsk100200.github.io/3d-portfolio-v1/](https://hafizsk100200.github.io/3d-portfolio-v1/)  
> 🌟 **Looking for Portfolio V2?** Check out the next-generation version at [hafizsk.qzz.io](https://hafizsk.qzz.io/)

---

## ✨ Key Features

* 🪞 **Interactive 3D Chromium Model Canvas**: Real-time GLTF rendering using React Three Fiber (`@react-three/fiber`) & Drei (`@react-three/drei`). Features custom physical materials with high-gloss chromium clearcoats, environment map reflection, and dynamic rotation synchronized to window scroll progress.
* 🌊 **Inertial Smooth Scrolling**: Powered by **Studio Freight Lenis**, ensuring stutter-free scroll transitions that harmonize with Framer Motion and GSAP scroll triggers.
* ⏱️ **Intelligent Preload Engine**: Custom `LoadingScreen` orchestrating font readiness, WebGL buffer compilation, texture preloads, and asset safety fallbacks with staggered counter animations.
* 📱 **Fully Responsive Layout**: Built with Tailwind CSS and responsive typography (Kanit font family) that scales seamlessly from ultra-wide 4K monitors down to mobile viewports.
* 🚀 **Zero-Lag Production Build**: Optimized bundling using Vite with code splitting, tree shaking, and subpath asset resolution ready for GitHub Pages or custom CDN deployment.
* 🛡️ **Hardened Client Security**: Client-side protection preventing unauthorized frame embedding and inspection.

---

## 🛠️ Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **[React 18](https://react.dev/)** | Component architecture & dynamic state rendering |
| **[TypeScript](https://www.typescriptlang.org/)** | Strict type safety, clean code maintainability, and DX |
| **[Three.js](https://threejs.org/)** | WebGL 3D scene engine, cameras, lighting, & mesh processing |
| **[@react-three/fiber](https://docs.pmnd.rs/react-three-fiber)** | Declarative React wrapper for Three.js |
| **[@react-three/drei](https://github.com/pmndrs/drei)** | Specialized 3D camera controls, loaders (`useGLTF`), and environment utilities |
| **[GSAP (GreenSock)](https://greensock.com/)** | High-performance timeline animation controls & marquee effects |
| **[Framer Motion](https://www.framer.com/motion/)** | Spring physics, entrance reveals, and scroll listener hooks |
| **[Lenis Scroll](https://lenis.darkroom.engineering/)** | Momentum-based, buttery smooth document scrolling |
| **[Tailwind CSS](https://tailwindcss.com/)** | Utility-first styling with sleek custom color palettes and dark mode aesthetic |
| **[Vite 8](https://vitejs.dev/)** | Next-generation lightning-fast frontend tooling and bundle compilation |

---

## 🚀 Quick Start

Want to run this project locally or use it as a foundation for your own creative projects? Follow these simple steps:

### Prerequisites

Make sure you have **Node.js 18+** installed on your system.
```bash
node -v
npm -v
```

### 1. Clone the Repository

```bash
git clone https://github.com/Hafizsk100200/3d-portfolio-v1.git
cd 3d-portfolio-v1
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```
Your browser will open at `http://localhost:5173` (or `http://localhost:5174`) with Hot Module Replacement (HMR) active.

### 4. Build for Production

```bash
npm run build
```
This compiles the project into a compact, production-ready `dist/` folder.

### 5. Preview Production Build Locally

```bash
npm run preview
```

---

## 📁 Project Structure

```
3d-portfolio-v1/
├── .github/
│   └── workflows/
│       └── deploy.yml        # Automated GitHub Pages CI/CD pipeline
├── public/
│   ├── favicon.ico
│   ├── favicon.png
│   └── model.glb             # 3D Head model asset (GLTF binary)
├── src/
│   ├── assets/               # Brand assets & static media
│   ├── components/
│   │   ├── LoadingScreen.tsx # Custom WebGL & asset preloader with counter
│   │   ├── Scroll3DCanvas.tsx# Three.js Canvas, multi-face chromium mesh & lighting
│   │   └── ScrollProgress.tsx# Dynamic scroll progress tracking bar
│   ├── sections/
│   │   ├── HeroSection.tsx   # Intro headline, CTA buttons, and interactive visual
│   │   ├── AboutSection.tsx  # Biography, creative focus, and skill matrix
│   │   ├── ServicesSection.tsx# Capabilities (3D Development, Frontend, Creative UI)
│   │   ├── ProjectsSection.tsx# Curated client & open-source project showcase
│   │   ├── ContactSection.tsx # Interactive contact form and social channels
│   │   └── Footer.tsx        # Copyright, location, and navigation links
│   ├── App.tsx               # Root application orchestrator
│   ├── main.tsx              # React DOM mounting entrypoint
│   └── index.css             # Tailwind base layers & global font definitions
├── index.html                # HTML entrypoint with Kanit Google Font preloading
├── package.json              # Project dependencies & scripts
├── tailwind.config.js        # Tailwind design system configuration
├── tsconfig.json             # TypeScript compiler settings
└── vite.config.ts            # Vite base path, plugins, and build configuration
```

---

## 👨‍💻 About the Developer

<table border="0">
 <tr>
    <td width="80" align="center" valign="middle">
      <img src="https://github.com/Hafizsk100200.png" width="70" height="70" style="border-radius:50%;" alt="Shaik Hafiz"/>
    </td>
    <td>
      <strong>Shaik Hafiz (Hafiz SK)</strong><br />
      <em>Creative Developer &amp; MERN Full-Stack Engineer</em><br />
      📍 Chilakaluripet, Palnadu, Andhra Pradesh, India<br />
      Specializing in Three.js, WebGL, React, TypeScript, and modern design-driven web applications.
    </td>
 </tr>
</table>

### Connect with Hafiz:
* 🌐 **Portfolio V2 (Latest):** [hafizsk.qzz.io](https://hafizsk.qzz.io/)
* 📸 **Instagram:** [@hafiz.sk_](https://www.instagram.com/hafiz.sk_/)
* 📧 **Email:** Available via portfolio contact form

---

## 📜 License

This project is licensed under the **MIT License** — feel free to explore, learn from, and adapt the code for your own creative projects. If you use this project for inspiration or reference, giving a star ⭐ to this repository is greatly appreciated!

---

<div align="center">
  <sub>Engineered with precision by <a href="https://hafizsk.qzz.io/">Shaik Hafiz</a>. If you find this project inspiring, please consider starring ⭐ the repository!</sub>
</div>
