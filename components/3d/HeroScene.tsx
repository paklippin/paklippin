'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Branded box texture — PAKLIPPIN inside a circle
function makeBrandTexture(accent: string, bg: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 512, 512);

  ctx.strokeStyle = accent;
  ctx.lineWidth = 12;
  ctx.strokeRect(6, 6, 500, 500);

  const cx = 256, cy = 256, r = 170;

  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = bg === '#FFF6F1' ? '#FFE6D9' : bg === '#F1FBF5' ? '#DFF3E7' : '#EAEAEA';
  ctx.fill();

  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.strokeStyle = accent;
  ctx.lineWidth = 10;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx, cy - 70, 34, 0, Math.PI * 2);
  ctx.fillStyle = accent;
  ctx.fill();
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 46px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('P', cx, cy - 66);

  ctx.fillStyle = accent;
  ctx.font = 'bold 52px Arial, sans-serif';
  ctx.fillText('PAKLIPPIN', cx, cy + 10);

  ctx.strokeStyle = accent;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx - 100, cy + 45);
  ctx.lineTo(cx + 100, cy + 45);
  ctx.stroke();

  ctx.fillStyle = '#888888';
  ctx.font = 'bold 17px Arial, sans-serif';
  ctx.fillText('TRUSTED STORE', cx, cy + 75);

  ctx.fillStyle = accent;
  ctx.font = 'bold 15px Arial, sans-serif';
  ctx.fillText('★  PAKISTAN  ★', cx, cy + 130);

  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}

// Sphere texture — PAKLIPPIN wrapped around the ball
function makeSphereTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Fill base color (matches sphere orange)
  ctx.fillStyle = '#FF6B35';
  ctx.fillRect(0, 0, 1024, 512);

  // Slightly lighter band top and bottom (adds depth when wrapped)
  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, 'rgba(255,255,255,0.15)');
  grad.addColorStop(0.5, 'rgba(255,255,255,0)');
  grad.addColorStop(1, 'rgba(0,0,0,0.15)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 512);

  // Main PAKLIPPIN text — repeats twice around the sphere so it's always visible
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 130px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('PAKLIPPIN', 256, 256);  // left copy
  ctx.fillText('PAKLIPPIN', 768, 256);  // right copy

  // Small star icons beside each
  ctx.font = 'bold 60px Arial, sans-serif';
  ctx.fillText('★', 40, 256);
  ctx.fillText('★', 984, 256);
  ctx.fillText('★', 470, 256);
  ctx.fillText('★', 552, 256);

  // Subtext — repeats too
  ctx.font = 'bold 34px Arial, sans-serif';
  ctx.fillStyle = '#FFE6D9';
  ctx.fillText('PAKISTAN\'S TRUSTED STORE', 256, 360);
  ctx.fillText('PAKISTAN\'S TRUSTED STORE', 768, 360);

  // Small tagline at top
  ctx.font = 'bold 28px Arial, sans-serif';
  ctx.fillStyle = '#FFF6F1';
  ctx.fillText('EST · 2026', 256, 140);
  ctx.fillText('EST · 2026', 768, 140);

  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}

export default function HeroScene() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const geo = new THREE.BoxGeometry(1.4, 1.4, 1.4);
    const edges = new THREE.EdgesGeometry(geo);

    const buildCube = (accent: string, bg: string) => {
      const tex = makeBrandTexture(accent, bg);
      const mat = new THREE.MeshBasicMaterial({ map: tex });
      const cube = new THREE.Mesh(geo, mat);
      const lines = new THREE.LineSegments(
        edges,
        new THREE.LineBasicMaterial({ color: accent })
      );
      lines.scale.setScalar(1.002);
      cube.add(lines);
      return cube;
    };

    const c1 = buildCube('#FF6B35', '#FFF6F1');
    c1.position.set(-2, 0, 0);
    scene.add(c1);

    const c2 = buildCube('#1A1A1A', '#F5F5F5');
    c2.position.set(2, 0, 0);
    scene.add(c2);

    const c3 = buildCube('#28A745', '#F1FBF5');
    c3.position.set(0, 2, 0);
    scene.add(c3);

    // ---- Branded sphere ----
    const sphereTex = makeSphereTexture();
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.6, 48, 48),
      new THREE.MeshBasicMaterial({ map: sphereTex })
    );
    scene.add(sphere);

    // Subtle outer glow ring (transparent orange sphere slightly bigger)
    const glow = new THREE.Mesh(
      new THREE.SphereGeometry(0.72, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0xFF6B35, transparent: true, opacity: 0.15 })
    );
    scene.add(glow);

    camera.position.z = 5;

    let raf = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      c1.rotation.x += 0.01;   c1.rotation.y += 0.01;
      c2.rotation.x -= 0.01;   c2.rotation.y -= 0.01;
      c3.rotation.x += 0.015;  c3.rotation.y += 0.015;

      // Sphere gently rotates so "PAKLIPPIN" orbits into view
      sphere.rotation.y += 0.008;

      // Pulse
      const pulse = 1 + Math.sin(Date.now() * 0.002) * 0.08;
      sphere.scale.setScalar(pulse);
      glow.scale.setScalar(pulse);

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      if (!container.clientWidth) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      try { renderer.forceContextLoss(); } catch {}
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={ref} className="w-full h-full rounded-3xl" />;
}
