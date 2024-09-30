import * as kokomi from "kokomi.js";
import * as THREE from "three";
import * as POSTPROCESSING from "postprocessing";
// @ts-ignore
import { N8AOPostPass } from "n8ao";

import type Experience from "./Experience";

export default class Postprocessing extends kokomi.Component {
  declare base: Experience;
  constructor(base: Experience) {
    super(base);

    const composer = new POSTPROCESSING.EffectComposer(this.base.renderer, {
      frameBufferType: THREE.HalfFloatType,
      multisampling: 8,
    });
    // @ts-ignore
    this.base.composer = composer;

    composer.addPass(
      new POSTPROCESSING.RenderPass(this.base.scene, this.base.camera)
    );

    const n8aopass = new N8AOPostPass(
      this.base.scene,
      this.base.camera,
      window.innerWidth,
      window.innerHeight
    );
    composer.addPass(n8aopass);
    n8aopass.configuration.aoRadius = 0.8;
    n8aopass.configuration.distanceFalloff = 0.4;
    n8aopass.configuration.intensity = 4;

    composer.addPass(
      new POSTPROCESSING.EffectPass(
        this.base.camera,
        new POSTPROCESSING.SMAAEffect({
          preset: POSTPROCESSING.SMAAPreset.ULTRA,
        })
      )
    );
  }
}
