import { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';

export default function AnimatedBackground() {
  const canvasRef = useRef(null);
  const { theme } = useApp();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animId;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Particles
    const NUM_PARTICLES = 55;
    const particles = Array.from({ length: NUM_PARTICLES }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 2.5 + 0.5,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      alpha: Math.random() * 0.5 + 0.1,
      color: Math.random() < 0.5 ? '#00e676' : Math.random() < 0.5 ? '#00bfa5' : '#40c4ff',
    }));

    // Floating leaves
    const LEAF_COUNT = 14;
    const leaves = Array.from({ length: LEAF_COUNT }, (_, i) => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 12 + 6,
      rot: Math.random() * Math.PI * 2,
      rotV: (Math.random() - 0.5) * 0.02,
      vy: Math.random() * 0.4 + 0.1,
      vx: Math.sin(i) * 0.3,
      alpha: Math.random() * 0.3 + 0.05,
    }));

    const drawLeaf = (x, y, size, rot, alpha) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.bezierCurveTo(size * 0.7, -size * 0.5, size * 0.7, size * 0.5, 0, size);
      ctx.bezierCurveTo(-size * 0.7, size * 0.5, -size * 0.7, -size * 0.5, 0, -size);
      ctx.fillStyle = '#00e676';
      ctx.fill();
      ctx.restore();
    };

    let t = 0;
    const draw = () => {
      t += 0.008;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const isDark = theme === 'dark';

      // Gradient orbs
      const orbs = [
        { cx: canvas.width * 0.15, cy: canvas.height * 0.25, r: 320, c1: isDark ? 'rgba(0,230,118,0.06)' : 'rgba(0,180,90,0.08)', c2: 'transparent' },
        { cx: canvas.width * 0.8,  cy: canvas.height * 0.7,  r: 280, c1: isDark ? 'rgba(0,191,165,0.07)' : 'rgba(0,150,120,0.08)', c2: 'transparent' },
        { cx: canvas.width * 0.5,  cy: canvas.height * 0.1,  r: 200, c1: isDark ? 'rgba(64,196,255,0.04)' : 'rgba(30,130,200,0.05)', c2: 'transparent' },
      ];
      orbs.forEach(o => {
        const g = ctx.createRadialGradient(
          o.cx + Math.sin(t) * 20, o.cy + Math.cos(t * 0.7) * 15, 0,
          o.cx, o.cy, o.r
        );
        g.addColorStop(0, o.c1);
        g.addColorStop(1, o.c2);
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      });

      // Grid lines
      ctx.strokeStyle = isDark ? 'rgba(0,230,118,0.025)' : 'rgba(0,150,80,0.04)';
      ctx.lineWidth = 1;
      const gridSize = 80;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
      }

      // Particles + connections
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      // Draw connections between close particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0,230,118,${0.06 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Leaves
      leaves.forEach(lf => {
        lf.y += lf.vy;
        lf.x += lf.vx + Math.sin(t + lf.rot) * 0.3;
        lf.rot += lf.rotV;
        if (lf.y > canvas.height + 30) {
          lf.y = -20;
          lf.x = Math.random() * canvas.width;
        }
        drawLeaf(lf.x, lf.y, lf.size, lf.rot, lf.alpha);
      });

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [theme]);

  return <canvas ref={canvasRef} id="eco-canvas" />;
}
