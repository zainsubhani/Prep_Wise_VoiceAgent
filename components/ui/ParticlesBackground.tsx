"use client";

import Particles from "react-tsparticles";

export default function ParticlesBackground() {
  return (
    <Particles
      id="tsparticles"
      options={{
        fullScreen: { enable: false },
        background: { color: "#0f0f1a" },
        fpsLimit: 60,
        particles: {
          color: { value: "#ffffff" },
          links: { color: "#ffffff", distance: 150, enable: true, opacity: 0.1, width: 1 },
          move: { enable: true, speed: 0.2, outModes: "bounce" },
          number: { value: 30, density: { enable: true, area: 800 } },
          opacity: { value: 0.3 },
          size: { value: { min: 1, max: 3 } },
        },
        interactivity: {
          events: {
            onHover: { enable: true, mode: "repulse" },
            onClick: { enable: true, mode: "push" },
          },
          modes: {
            repulse: { distance: 100, duration: 0.4 },
            push: { quantity: 4 },
          },
        },
        detectRetina: true,
      }}
      className="w-full h-full absolute inset-0 -z-10"
    />
  );
}