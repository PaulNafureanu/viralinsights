"use client";
import { useRef, useEffect } from "react";
import ThreeModule from "@/lib/three/ThreeModule";
import type { Group } from "@/types/three/src/objects/Group";
import type { Mesh } from "@/types/three/src/objects/Mesh";
import type { Material } from "@/types/three/src/materials/Material";
import type { Texture } from "@/types/three/src/textures/Texture";

const ThreeRenderer = () => {
  console.time("TR");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const init = async () => {
    const getModule = ThreeModule.getModule;
    const [
      { WebGLRenderer },
      { Scene },
      { PerspectiveCamera },
      { Mesh },
      { PlaneGeometry },
      { MeshBasicMaterial },
      { OrbitControls },
      { GLTFLoader },
      { Color },
      { RGBELoader },
      {
        EquirectangularReflectionMapping,
        ACESFilmicToneMapping,
        SRGBColorSpace,
        RepeatWrapping,
      },
      { Vector3 },
    ] = await Promise.all([
      getModule("WebGLRenderer"),
      getModule("Scene"),
      getModule("PerspectiveCamera"),
      getModule("Mesh"),
      getModule("PlaneGeometry"),
      getModule("MeshBasicMaterial"),
      getModule("OrbitControls"),
      getModule("GLTFLoader"),
      getModule("Color"),
      getModule("RGBELoader"),
      getModule("Constants"),
      getModule("Vector3"),
    ]);

    const renderer = new WebGLRenderer({
      antialias: true,
      canvas: canvasRef.current!,
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.pixelRatio = window.devicePixelRatio;

    const scene = new Scene();
    scene.background = new Color(0xa3a3a3);
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
    plane.rotation.x = -Math.PI / 2;
    scene.add(plane);

    const rgbeLoader = new RGBELoader();
    const gltfLoader = new GLTFLoader();

    renderer.outputColorSpace = SRGBColorSpace;
    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.toneMappingExposure = 4;

    let porsche: undefined | Group;

    const HDR = "/hdri/WhiteNeons.hdr";
    const RGBE = "/hdri/WN20R.rgbe";

    const rawMap = await fetch("/models/porsche/output/map.json");
    const map = await rawMap.json();

    rgbeLoader.load(RGBE, (texture) => {
      texture.mapping = EquirectangularReflectionMapping;
      scene.environment = texture;

      gltfLoader.load("/models/porsche/scene.gltf", (gltf) => {
        porsche = gltf.scene;

        const isArrayOfMaterials = (
          mat: Material | Material[]
        ): mat is Material[] => {
          return Array.isArray(mat) && mat.every((m) => m.isMaterial);
        };

        const getTextureCoord = (
          materialName: keyof (typeof map)["materials"],
          textureKey: string
        ) => {
          const material = map["materials"][materialName];
          const keyToType = {
            map: "baseColorTexture",
            roughnessMap: "metallicRoughnessTexture",
            metalnessMap: "metallicRoughnessTexture",
            normalMap: "normalTexture",
            aoMap: "occlusionTexture",
            clearcoatMap: "clearcoatTexture",
            clearcoatRoughnessMap: "clearcoatRoughnessTexture",
            clearcoatNormalMap: "clearcoatNormalTexture",
          };
          const key = textureKey as keyof typeof keyToType;

          if ("texturesUsed" in material) {
            let textureName = material.texturesUsed.find(
              (texture: any) => texture.type === keyToType[key]
            )?.name as keyof (typeof map)["textures"];

            if (!textureName)
              textureName = material.texturesUsed[0]
                .name as keyof (typeof map)["textures"];

            if (textureName) return map["textures"][textureName];
          }
        };

        const AddTexturesToMaterial = (material: any) => {
          for (const key in material) {
            if (
              material[key] &&
              typeof material[key] === "object" &&
              key.toLocaleLowerCase().includes("map")
            ) {
              const texture = material[key] as Texture;
              const newTextureCoord = getTextureCoord(material.name, key);
              if (texture.isTexture && newTextureCoord) {
                const newTexture = texture.clone();
                newTexture.wrapS = RepeatWrapping;
                newTexture.wrapT = RepeatWrapping;
                const { repeat, offset } = newTextureCoord;
                newTexture.offset.set(offset[0], offset[1]);
                newTexture.repeat.set(repeat[0], repeat[1]);
                newTexture.needsUpdate = true;
                material[key] = newTexture;
              }
            }
          }
          material.needsUpdate = true;
        };

        porsche.traverse((node) => {
          const child = node as Mesh;
          if (child.isMesh) {
            if (isArrayOfMaterials(child.material))
              child.material.forEach((mat) => AddTexturesToMaterial(mat));
            else AddTexturesToMaterial(child.material);
          }
        });

        scene.add(porsche);

        console.timeEnd("TR");
      });
    });

    renderer.setAnimationLoop((time) => {
      if (porsche) {
        // porsche.rotation.y = -time / 1000;
      }

      renderer.render(scene, camera);
    });

    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    window.addEventListener("keydown", (e) => {
      const zoomFactor = 1;
      const direction = new Vector3();
      camera.getWorldDirection(direction);

      switch (e.key) {
        case "ArrowUp": {
          camera.position.addScaledVector(direction, zoomFactor);
          break;
        }
        case "ArrowDown": {
          camera.position.addScaledVector(direction, -zoomFactor);
          break;
        }
      }
    });

    console.timeLog("TR");
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
