"use client";
import ThreeModule from "@/lib/three/ThreeModule";
import { useRef, useEffect } from "react";

const ThreeRenderer = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const init = async () => {
    const Three = await ThreeModule.getModule("Three");
    const { OrbitControls } = await ThreeModule.getModule("OrbitControls");

    const renderer = new Three.WebGLRenderer({
      antialias: true,
      canvas: canvasRef.current!,
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.pixelRatio = window.devicePixelRatio;

    const scene = new Three.Scene();
    const camera = new Three.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.01,
      1000
    );
    camera.position.set(10, 10, 10);

    const controls = new OrbitControls(camera, canvasRef.current!);
    controls.update();

    const plane = new Three.Mesh(
      new Three.PlaneGeometry(10, 10),
      new Three.MeshBasicMaterial({ wireframe: true, color: 0xffff00 })
    );
    scene.add(plane);

    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });

    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  };

  useEffect(() => {
    init();
  }, []);

  return <canvas ref={canvasRef} />;
};

export default ThreeRenderer;
