"use client";

import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  color: string;
}

interface PixelAvatarProps {
  imageSrc: string;
  width?: number;
  height?: number;
  particleSize?: number;
  resolution?: number; // How many pixels to skip. Lower = more particles
}

export default function PixelAvatar({
  imageSrc,
  width = 240,
  height = 300,
  particleSize = 3,
  resolution = 4,
}: PixelAvatarProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999, radius: 60 });
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // Handle high DPI displays
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    const image = new Image();
    image.src = imageSrc;
    // Handle caching issues for local dev
    image.crossOrigin = "Anonymous";

    image.onload = () => {
      // Calculate aspect ratio to fit the canvas properly
      const scale = Math.max(width / image.width, height / image.height);
      const imgWidth = image.width * scale;
      const imgHeight = image.height * scale;
      const xOffset = (width - imgWidth) / 2;
      const yOffset = (height - imgHeight) / 2;

      // Draw original image to extract pixel data
      ctx.clearRect(0, 0, width * dpr, height * dpr);
      ctx.drawImage(image, xOffset, yOffset, imgWidth, imgHeight);

      const imageData = ctx.getImageData(0, 0, width * dpr, height * dpr);
      const pixels = imageData.data;
      
      const particles: Particle[] = [];

      // Loop through pixels based on resolution
      // We scale the loop by dpr to ensure we sample correctly on retina displays
      for (let y = 0; y < height; y += resolution) {
        for (let x = 0; x < width; x += resolution) {
          // Calculate the exact pixel index in the flat array
          const pixelX = Math.floor(x * dpr);
          const pixelY = Math.floor(y * dpr);
          const index = (pixelY * (width * dpr) + pixelX) * 4;

          const r = pixels[index];
          const g = pixels[index + 1];
          const b = pixels[index + 2];
          const a = pixels[index + 3];

          // Calculate grayscale
          const gray = Math.floor((r + g + b) / 3);
          
          // Ignore transparent pixels AND light backgrounds (gray > 220)
          if (a > 50 && gray < 220) {
            
            // Retain original alpha (opacity)
            const alpha = a / 255;
            
            particles.push({
              x: x,
              y: y,
              originX: x,
              originY: y,
              vx: 0,
              vy: 0,
              color: `rgba(${gray}, ${gray}, ${gray}, ${alpha})`,
            });
          }
        }
      }

      particlesRef.current = particles;
      ctx.clearRect(0, 0, width, height);
      animate();
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      const particles = particlesRef.current;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const radius = mouseRef.current.radius;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Distance from mouse
        const dx = mx - p.x;
        const dy = my - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Magnetic repel logic
        if (distance < radius) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const force = (radius - distance) / radius; 
          
          p.vx -= forceDirectionX * force * 5;
          p.vy -= forceDirectionY * force * 5;
        }

        // Spring logic (pull back to origin)
        p.vx += (p.originX - p.x) * 0.1;
        p.vy += (p.originY - p.y) * 0.1;

        // Friction
        p.vx *= 0.8;
        p.vy *= 0.8;

        // Update position
        p.x += p.vx;
        p.y += p.vy;

        // Draw particle using its actual grayscale color
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, particleSize / 2, 0, Math.PI * 2);
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      // Move mouse out of range
      mouseRef.current.x = -9999;
      mouseRef.current.y = -9999;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationRef.current);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [imageSrc, width, height, particleSize, resolution]);

  return (
    <canvas
      ref={canvasRef}
      className="cursor-crosshair block"
      style={{
        // Remove background so it blends seamlessly like a cutout
        backgroundColor: 'transparent',
      }}
    />
  );
}
