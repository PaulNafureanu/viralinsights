"use client";
import ThreeModule from "@/lib/three/ThreeModule";
import { useRef, useEffect } from "react";

const ThreeRenderer = () => {
  console.time("TR");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const init = async () => {
    const [
      WebGLRendererPromise,
      ScenePromise,
      PerspectiveCameraPromise,
      MeshPromise,
      PlaneGeometryPromise,
      MeshBasicMaterialPromise,
      OrbitControlsPromise,
    ] = await Promise.all([
      ThreeModule.getModule("WebGLRenderer"),
      ThreeModule.getModule("Scene"),
      ThreeModule.getModule("PerspectiveCamera"),
      ThreeModule.getModule("Mesh"),
      ThreeModule.getModule("PlaneGeometry"),
      ThreeModule.getModule("MeshBasicMaterial"),
      ThreeModule.getModule("OrbitControls"),
    ]);

    const { WebGLRenderer } = WebGLRendererPromise;
    const { Scene } = ScenePromise;
    const { PerspectiveCamera } = PerspectiveCameraPromise;
    const { Mesh } = MeshPromise;
    const { PlaneGeometry } = PlaneGeometryPromise;
    const { MeshBasicMaterial } = MeshBasicMaterialPromise;
    const { OrbitControls } = OrbitControlsPromise;

    const renderer = new WebGLRenderer({
      antialias: true,
      canvas: canvasRef.current!,
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.pixelRatio = window.devicePixelRatio;

    const scene = new Scene();
    const camera = new PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.01,
      1000
    );
    camera.position.set(10, 10, 10);

    const controls = new OrbitControls(camera, canvasRef.current!);
    controls.update();

    const plane = new Mesh(
      new PlaneGeometry(10, 10),
      new MeshBasicMaterial({ wireframe: true, color: 0xffff00 })
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

    console.timeEnd("TR");
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <div>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default ThreeRenderer;
