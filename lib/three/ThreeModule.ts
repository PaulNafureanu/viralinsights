/**
 * ThreeModule ensures one-time loading of the three js module and its functionality
 * during the entire app runtime.
 */
class ThreeModule {
  private static Imports = {
    WebGLRenderer: () => import("three/src/renderers/WebGLRenderer"),
    Scene: () => import("three/src/scenes/Scene"),
    PerspectiveCamera: () => import("three/src/cameras/PerspectiveCamera"),
    Mesh: () => import("three/src/objects/Mesh"),
    PlaneGeometry: () => import("three/src/geometries/PlaneGeometry"),
    MeshBasicMaterial: () => import("three/src/materials/MeshBasicMaterial"),
    OrbitControls: () => import("three/examples/jsm/controls/OrbitControls"),
    GLTFLoader: () => import("three/examples/jsm/loaders/GLTFLoader"),
    DracoLoader: () => import("three/examples/jsm/loaders/DRACOLoader"),
    RGBELoader: () => import("three/examples/jsm/loaders/RGBELoader"),
    TextureLoader: () => import("three/src/loaders/TextureLoader"),
    Texture: () => import("three/src/textures/Texture"),
    Constants: () => import("three/src/constants"),
    Vector3: () => import("three/src/math/Vector3"),
    Color: () => import("three/src/math/Color"),
  };

  private static Modules: Record<keyof typeof ThreeModule.Imports, any> =
    {} as Record<keyof typeof ThreeModule.Imports, any>;

  private constructor() {}

  static getModule = async <T extends keyof (typeof ThreeModule)["Imports"]>(
    module: T
  ) => {
    if (!ThreeModule.Modules[module])
      ThreeModule.Modules[module] = await ThreeModule.Imports[module]();

    return ThreeModule.Modules[module] as ReturnType<
      (typeof ThreeModule)["Imports"][T]
    >;
  };
}

export default ThreeModule;

// async (canvasRef: any) => {

//   const [
//     WebGLRendererPromise,
//     ScenePromise,
//     PerspectiveCameraPromise,
//     MeshPromise,
//     PlaneGeometryPromise,
//     MeshBasicMaterialPromise,
//     OrbitControlsPromise,
//   ] = await Promise.all([
//     ThreeModule.getModule("WebGLRenderer"),
//     ThreeModule.getModule("Scene"),
//     ThreeModule.getModule("PerspectiveCamera"),
//     ThreeModule.getModule("Mesh"),
//     ThreeModule.getModule("PlaneGeometry"),
//     ThreeModule.getModule("MeshBasicMaterial"),
//     ThreeModule.getModule("OrbitControls"),
//   ]);

//   const { WebGLRenderer } = WebGLRendererPromise;
//   const { Scene } = ScenePromise;
//   const { PerspectiveCamera } = PerspectiveCameraPromise;
//   const { Mesh } = MeshPromise;
//   const { PlaneGeometry } = PlaneGeometryPromise;
//   const { MeshBasicMaterial } = MeshBasicMaterialPromise;
//   const { OrbitControls } = OrbitControlsPromise;

//   const renderer = new WebGLRenderer({
//     antialias: true,
//     canvas: canvasRef.current!,
//   });

//   renderer.setSize(window.innerWidth, window.innerHeight);
//   renderer.pixelRatio = window.devicePixelRatio;

//   const scene = new Scene();
//   const camera = new PerspectiveCamera(
//     75,
//     window.innerWidth / window.innerHeight,
//     0.01,
//     1000
//   );
//   camera.position.set(10, 10, 10);

//   const controls = new OrbitControls(camera, canvasRef.current!);
//   controls.update();

//   const plane = new Mesh(
//     new PlaneGeometry(10, 10),
//     new MeshBasicMaterial({ wireframe: true, color: 0xffff00 })
//   );
//   scene.add(plane);

//   renderer.setAnimationLoop(() => {
//     renderer.render(scene, camera);
//   });

//   window.addEventListener("resize", () => {
//     camera.aspect = window.innerWidth / window.innerHeight;
//     camera.updateProjectionMatrix();
//     renderer.setSize(window.innerWidth, window.innerHeight);
//   });
// };
