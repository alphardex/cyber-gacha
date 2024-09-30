import * as kokomi from "kokomi.js";
import * as THREE from "three";
import * as CANNON from "cannon-es";

import type Experience from "../Experience";

export default class MouseBall extends kokomi.Component {
  declare base: Experience;
  mesh: THREE.Mesh;
  body: CANNON.Body;
  targetPosition!: CANNON.Vec3;
  constructor(base: Experience) {
    super(base);

    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.8, 64, 64),
      new THREE.MeshBasicMaterial()
    );
    this.mesh = mesh;
    this.mesh.visible = false;

    const shape = new CANNON.Sphere(0.8);
    const body = new CANNON.Body({
      mass: 0.3,
      shape,
      type: CANNON.Body.KINEMATIC,
    });
    this.body = body;

    const rs = new kokomi.RaycastSelector(this.base);
    window.addEventListener("pointermove", () => {
      const target = rs.getFirstIntersect();
      if (target) {
        this.targetPosition = new CANNON.Vec3(
          target.point.x,
          target.point.y,
          target.point.z
        );
      }
    });
  }
  addExisting() {
    this.container.add(this.mesh);
    this.base.physics.add({ mesh: this.mesh, body: this.body });
  }
  update() {
    if (this.targetPosition) {
      this.body.position.copy(this.targetPosition);
    }
  }
}
