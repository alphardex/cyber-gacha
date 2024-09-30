import * as kokomi from "kokomi.js";
import * as THREE from "three";
import * as CANNON from "cannon-es";
import { Howl } from "howler";

import type Experience from "../Experience";

import TestObject from "./TestObject";
import BaseContainer from "./BaseContainer";
import GachaBall from "./GachaBall";
import MouseBall from "./MouseBall";

import { sampleSize } from "../utils";
import { atariConfetti } from "../effects";

const rarityColorMap = {
  5: "gold",
  4: "purple",
  3: "skyblue",
};

const getRarity = () => {
  let rarity = 3;
  const p = Math.random();
  if (p > 0 && p <= 0.006) {
    rarity = 5;
  } else if (p > 0.006 && p <= 0.057) {
    rarity = 4;
  } else if (p > 0.057) {
    rarity = 3;
  }
  return rarity;
};

export default class World extends kokomi.Component {
  declare base: Experience;
  testObject: TestObject | null;
  applauseSE!: Howl;
  hitSE!: Howl;
  gcs!: GachaBall[];
  bc!: BaseContainer | null;
  slipperyMat!: CANNON.Material | null;
  mb!: MouseBall | null;
  drawCount!: number;
  goldCount!: number;
  constructor(base: Experience) {
    super(base);

    this.base.physics.world.allowSleep = true;

    this.testObject = null;

    this.drawCount = 0;
    this.goldCount = 0;

    this.applauseSE = new Howl({
      src: ["audios/Applause1.mp3"],
    });
    this.hitSE = new Howl({
      src: ["audios/Cursor1.mp3"],
    });

    this.gcs = [];

    this.base.am.on("ready", () => {
      document.querySelector(".loader-screen")?.classList.add("hollow");

      const skybox = this.base.am.items["skybox"];
      skybox.mapping = THREE.EquirectangularReflectionMapping;
      this.base.scene.environment = skybox;

      const stage = new kokomi.Stage(this.base, {
        intensity: Math.PI,
        preset: "soft",
      });
      stage.addExisting();

      const bc = new BaseContainer(this.base);
      bc.addExisting();
      this.bc = bc;

      const mb = new MouseBall(this.base);
      mb.addExisting();
      this.mb = mb;

      this.addSlip();

      // this.generateInitialGachaBalls();

      const debugObj = {
        drawOne: () => this.generateRandomBall(),
        drawTen: () => this.generateRandomBalls(10),
        removeAll: () => this.removeAllBalls(),
        screenshot: () => this.base.saveScreenshot(),
      };

      const debug = this.base.debug;
      if (debug.active) {
        const debugFolder = debug.ui?.addFolder("扭蛋");
        debugFolder?.add(debugObj, "drawOne").name("抽一次");
        debugFolder?.add(debugObj, "drawTen").name("十连抽");
        debugFolder?.add(debugObj, "removeAll").name("清空");
        debugFolder?.add(debugObj, "screenshot").name("截图");
        debugFolder?.add(this, "drawCount").name("已抽次数").listen();
        debugFolder?.add(this, "goldCount").name("出金次数").listen();
      }
    });
  }
  generateGachaBall(
    position = new CANNON.Vec3(0, 3, 0),
    color = "",
    rarity = getRarity()
  ) {
    const gc = new GachaBall(this.base, {
      position,
      color: color || (rarityColorMap as any)[rarity],
      rarity,
    });
    const playHitSound = (collision: any) => {
      const impactStrength = collision.contact.getImpactVelocityAlongNormal();
      if (impactStrength > 5) {
        this.hitSE.volume(Math.random());
        this.hitSE.stop();
        this.hitSE.play();
      }
    };
    gc.body.addEventListener("collide", playHitSound);
    gc.on("remove", () => {
      gc.body.removeEventListener("collide", playHitSound);
    });
    gc.addExisting();
    this.gcs.push(gc);
    this.drawCount += 1;
    if (rarity === 5) {
      this.goldCount += 1;
      atariConfetti();
      this.applauseSE.play();
    }
  }
  generateBallPositions() {
    const posArr = [];
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 6; j++) {
        const position = new CANNON.Vec3(
          0.6 * i - 1.25 + THREE.MathUtils.randFloatSpread(0.2),
          5 + THREE.MathUtils.randFloatSpread(2.5),
          0.6 * j - 1.25 + THREE.MathUtils.randFloatSpread(0.2)
        );
        posArr.push(position);
      }
    }
    return posArr;
  }
  generateInitialGachaBalls() {
    const posArr = this.generateBallPositions();
    posArr.forEach((position) => {
      this.generateGachaBall(position);
    });
  }
  generateRandomBalls(count = 10) {
    const posArr = this.generateBallPositions();
    const positions = sampleSize(posArr, count);
    positions.forEach((position) => this.generateGachaBall(position));
  }
  generateRandomBall() {
    this.generateRandomBalls(1);
  }
  removeAllBalls() {
    this.gcs.forEach((gc) => gc.remove());
    this.gcs = [];
  }
  addSlip() {
    const groundMaterial = new CANNON.Material("groundMaterial");

    // Adjust constraint equation parameters for ground/ground contact
    const ground_ground_cm = new CANNON.ContactMaterial(
      groundMaterial,
      groundMaterial,
      {
        friction: 0.4,
        restitution: 0.3,
        contactEquationStiffness: 1e8,
        contactEquationRelaxation: 3,
        frictionEquationStiffness: 1e8,
        // @ts-ignore
        frictionEquationRegularizationTime: 3,
      }
    );

    // Add contact material to the world
    this.base.physics.world.addContactMaterial(ground_ground_cm);

    this.bc!.body1.material = groundMaterial;

    // Create a slippery material (friction coefficient = 0.0)
    const slipperyMaterial = new CANNON.Material("slipperyMaterial");

    // The ContactMaterial defines what happens when two materials meet.
    // In this case we want friction coefficient = 0.0 when the slippery material touches ground.
    const slippery_ground_cm = new CANNON.ContactMaterial(
      groundMaterial,
      slipperyMaterial,
      {
        friction: 0.2,
        restitution: 0.24,
        contactEquationStiffness: 1e8,
        contactEquationRelaxation: 3,
      }
    );

    // We must add the contact materials to the world
    this.base.physics.world.addContactMaterial(slippery_ground_cm);

    this.slipperyMat = slipperyMaterial;
  }
  update(): void {
    this.gcs.forEach((gc) => {
      if (gc.body.position.y < -5) {
        gc.remove();
      }
    });
  }
}
