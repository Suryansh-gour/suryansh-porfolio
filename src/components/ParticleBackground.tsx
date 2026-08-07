import React, { useEffect, useRef } from "react";
import { useTheme } from "./ThemeProvider";

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const mouse = { x: 0, y: 0, radius: 120 };

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      baseOpacity: number;
      opacity: number;

      constructor(w: number, h: number) {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.size = Math.random() * 2 + 1;
        this.baseOpacity = Math.random() * 0.15 + 0.05;
        this.opacity = this.baseOpacity;
      }

      update(w: number, h: number) {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce on boundaries
        if (this.x < 0 || this.x > w) this.vx *= -1;
        if (this.y < 0 || this.y > h) this.vy *= -1;

        // Interaction with mouse
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;
          this.opacity = Math.min(0.5, this.baseOpacity + force * 0.35);
          // Gently push particles away or pull them
          this.x -= dx * force * 0.02;
          this.y -= dy * force * 0.02;
        } else {
          if (this.opacity > this.baseOpacity) {
            this.opacity -= 0.01;
          }
        }
      }

      draw(c: CanvasRenderingContext2D, color: string) {
        c.save();
        c.beginPath();
        c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        c.fillStyle = color.replace("OPACITY", this.opacity.toString());
        c.fill();
        c.restore();
      }
    }

    const init = () => {
      const w = (canvas.width = window.innerWidth);
      const h = (canvas.height = window.innerHeight);
      const density = Math.floor((w * h) / 10000); // Responsive density
      particles = [];
      const cap = Math.min(density, 120); // Cap particles count for performance
      for (let i = 0; i < cap; i++) {
        particles.push(new Particle(w, h));
      }
    };

    const handleResize = () => {
      init();
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);

    init();

    // Particle styling based on theme
    // We replace 'OPACITY' dynamically when drawing
    const getParticleColor = () => {
      return theme === "dark" 
        ? "rgba(6, 182, 212, OPACITY)" // cyan for dark
        : "rgba(37, 99, 235, OPACITY)"; // blue for light
    };

    const getLineColor = () => {
      return theme === "dark"
        ? "rgba(124, 58, 237, OPACITY)" // violet for dark
        : "rgba(124, 58, 237, OPACITY)"; 
    };

    const animate = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const pColor = getParticleColor();
      const lColor = getLineColor();

      // Update and draw particles
      particles.forEach((p) => {
        p.update(w, h);
        p.draw(ctx, pColor);
      });

      // Draw connection lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i]!;
          const b = particles[j]!;
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 110) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            const lineOpacity = (110 - distance) / 110 * 0.08;
            ctx.strokeStyle = lColor.replace("OPACITY", lineOpacity.toString());
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 w-full h-full pointer-events-none"
    />
  );
}
