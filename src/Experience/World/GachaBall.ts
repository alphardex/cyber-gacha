import * as kokomi from "kokomi.js";
import * as THREE from "three";
import * as STDLIB from "three-stdlib";
import * as CANNON from "cannon-es";

import type Experience from "../Experience";

interface GachaBallConfig {
  color: string;
  scale: number;
  position: CANNON.Vec3;
  rarity: number;
}

export default class GachaBall extends kokomi.Component {
  declare base: Experience;
  rarity: number;
  model: STDLIB.GLTF;
  group: THREE.Group;
  material: THREE.MeshStandardMaterial;
  body: CANNON.Body;
  constructor(base: Experience, config: Partial<GachaBallConfig> = {}) {
    super(base);

    const {
      color = "red",
      scale = 0.6,
      position = new CANNON.Vec3(0, 5, 0),
      rarity = 2,
    } = config;
    this.rarity = rarity;

    const model = this.base.am.items["gachaBall"] as STDLIB.GLTF;
    this.model = model;

    const group = this.model.scene.clone();
    const modelParts = kokomi.flatModel(group);
    // kokomi.printModel(modelParts);
    const Ball_Mesh = modelParts[4];
    Ball_Mesh.castShadow = true;
    Ball_Mesh.receiveShadow = true;

    this.group = group;
    group.scale.setScalar(0.01 * scale);

    const Ball_Mesh_Ball_Base_Material_0 = modelParts[5] as THREE.Mesh;
    const material =
      Ball_Mesh_Ball_Base_Material_0.material as THREE.MeshStandardMaterial;
    this.material = material.clone();
    this.material.map = null;
    this.material.color.set(new THREE.Color(color));
    Ball_Mesh_Ball_Base_Material_0.material = this.material;

    const shape = new CANNON.Sphere(0.5 * scale);
    const body = new CANNON.Body({
      mass: 1,
      // mass: 0,
      shape,
      material: this.base.world.slipperyMat!,
    });
    this.body = body;
    this.body.position.copy(position);

    const velocity = new CANNON.Vec3(
      THREE.MathUtils.randFloatSpread(2),
      -2,
      THREE.MathUtils.randFloatSpread(2)
    );
    this.body.velocity.copy(velocity);
    const angularVelocity = new CANNON.Vec3(
      Math.random(),
      Math.random(),
      Math.random()
    );
    this.body.angularVelocity.copy(angularVelocity);
    this.body.angularDamping = 0.4;
  }
  addExisting() {
    this.container.add(this.group);
    this.base.physics.add({ mesh: this.group, body: this.body });
  }
  update() {}
  remove() {
    this.container.remove(this.group);
    this.base.physics.world.removeBody(this.body);
  }
}
