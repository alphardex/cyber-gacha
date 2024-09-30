import * as kokomi from "kokomi.js";
import * as THREE from "three";
import * as CANNON from "cannon-es";

import type Experience from "../Experience";

export default class BaseContainer extends kokomi.Component {
  declare base: Experience;
  group: THREE.Group;
  mesh1: THREE.Mesh;
  body1: CANNON.Body;
  mesh2: THREE.Mesh;
  body2: CANNON.Body;
  mesh3: THREE.Mesh;
  body3: CANNON.Body;
  mesh4: THREE.Mesh;
  body4: CANNON.Body;
  mesh5: THREE.Mesh;
  body5: CANNON.Body;
  constructor(base: Experience) {
    super(base);

    const group = new THREE.Group();
    this.group = group;

    const height = 0.625;
    const cornerWidth = 0.2;

    const material = new THREE.MeshStandardMaterial();
    const mesh1 = new THREE.Mesh(new THREE.BoxGeometry(5, 0.1, 5), material);
    mesh1.receiveShadow = true;
    this.mesh1 = mesh1;
    this.group.add(this.mesh1);
    const shape1 = new CANNON.Box(new CANNON.Vec3(2.5, 0.05, 2.5));
    const body1 = new CANNON.Body({
      mass: 0,
      shape: shape1,
    });
    this.body1 = body1;

    const mesh2 = new THREE.Mesh(
      new THREE.BoxGeometry(5 + cornerWidth, height, 0.1),
      material
    );
    mesh2.receiveShadow = true;
    this.mesh2 = mesh2;
    this.group.add(this.mesh2);
    const shape2 = new CANNON.Box(
      new CANNON.Vec3(2.5 + cornerWidth / 2, height / 2, 0.05)
    );
    const body2 = new CANNON.Body({
      mass: 0,
      shape: shape2,
    });
    body2.position.z = 2.5 + 0.05;
    body2.position.y = height / 2 - 0.05;
    this.body2 = body2;

    const mesh3 = new THREE.Mesh(
      new THREE.BoxGeometry(5 + cornerWidth, height, 0.1),
      material
    );
    mesh3.receiveShadow = true;
    this.mesh3 = mesh3;
    this.group.add(this.mesh3);
    const shape3 = new CANNON.Box(
      new CANNON.Vec3(2.5 + cornerWidth / 2, height / 2, 0.05)
    );
    const body3 = new CANNON.Body({
      mass: 0,
      shape: shape3,
    });
    body3.position.z = -2.5 - 0.05;
    body3.position.y = height / 2 - 0.05;
    this.body3 = body3;

    const mesh4 = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, height, 5 + cornerWidth),
      material
    );
    mesh4.receiveShadow = true;
    this.mesh4 = mesh4;
    this.group.add(this.mesh4);
    const shape4 = new CANNON.Box(
      new CANNON.Vec3(0.05, height / 2, 2.5 + cornerWidth / 2)
    );
    const body4 = new CANNON.Body({
      mass: 0,
      shape: shape4,
    });
    body4.position.x = 2.5 + 0.05;
    body4.position.y = height / 2 - 0.05;
    this.body4 = body4;

    const mesh5 = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, height, 5 + cornerWidth),
      material
    );
    mesh5.receiveShadow = true;
    this.mesh5 = mesh5;
    this.group.add(this.mesh5);
    const shape5 = new CANNON.Box(
      new CANNON.Vec3(0.05, height / 2, 2.5 + cornerWidth / 2)
    );
    const body5 = new CANNON.Body({
      mass: 0,
      shape: shape5,
    });
    body5.position.x = -2.5 - 0.05;
    body5.position.y = height / 2 - 0.05;
    this.body5 = body5;
  }
  addExisting() {
    this.container.add(this.group);
    this.base.physics.add({ mesh: this.mesh1, body: this.body1 });
    this.base.physics.add({ mesh: this.mesh2, body: this.body2 });
    this.base.physics.add({ mesh: this.mesh3, body: this.body3 });
    this.base.physics.add({ mesh: this.mesh4, body: this.body4 });
    this.base.physics.add({ mesh: this.mesh5, body: this.body5 });
  }
  update() {}
}
