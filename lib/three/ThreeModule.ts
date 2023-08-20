/**
 * ThreeModule ensures one-time loading of the three js module and its functionality
 * during the entire app runtime.
 */
class ThreeModule {
  private static Imports = {
    Three: () => import("three"),
    OrbitControls: () => import("three/examples/jsm/controls/OrbitControls"),
    GLTFLoader: () => import("three/examples/jsm/loaders/GLTFLoader"),
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
