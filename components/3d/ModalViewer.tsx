'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ModalViewer() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xF8F9FA);
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'low-power' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(5, 5, 5);
    scene.add(dir);

    const cube = new THREE.Mesh(
      new THREE.BoxGeometry(2, 2, 2),
      new THREE.MeshStandardMaterial({ color: 0xFF6B35, roughness: 0.2, metalness: 0.5 })
    );
    scene.add(cube);

    const pGeo = new THREE.BufferGeometry();
    const count = 60;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) pos[i] = (Math.random() - 0.5) * 10;
    pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const particles = new THREE.Points(
      pGeo,
      new THREE.PointsMaterial({ size: 0.05, color: 0xFF6B35, transparent: true, opacity: 0.6 })
    );
    scene.add(particles);
    camera.position.z = 5;

    let mx = 0, my = 0;
    const onMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      my = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };
    container.addEventListener('mousemove', onMove);

    let raf = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      cube.rotation.x += 0.01 + my * 0.0005;
      cube.rotation.y += 0.01 + mx * 0.0005;
      particles.rotation.y += 0.001;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      container.removeEventListener('mousemove', onMove);
      renderer.dispose();
      try { renderer.forceContextLoss(); } catch {}
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
    };
  }, []);
  return <div ref={ref} className="w-full h-full" />;
}
