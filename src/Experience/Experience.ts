import * as kokomi from "kokomi.js";

import World from "./World/World";

import Debug from "./Debug";

import Postprocessing from "./Postprocessing";

import { resources } from "./resources";

export default class Experience extends kokomi.Base {
  world: World;
  debug: Debug;
  am: kokomi.AssetManager;
  post: Postprocessing;
  constructor(sel = "#sketch") {
    super(sel);

    (window as any).experience = this;

    // kokomi.enableShadow(this.renderer);

    this.renderer.setClearColor(0xeeeeee, 1);

    this.debug = new Debug();

    this.am = new kokomi.AssetManager(this, resources);

    const camera = new kokomi.OrthographicCamera({
      frustum: 5,
    });
    this.camera = camera;
    this.camera.position.set(-6, 5, 6);
    new kokomi.OrbitControls(this);

    this.world = new World(this);

    this.post = new Postprocessing(this);
  }
}
