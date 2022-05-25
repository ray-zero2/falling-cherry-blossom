import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default class Camera extends THREE.PerspectiveCamera {
  constructor(options = {}) {
    super(options?.fov, options?.aspect, options?.near, options?.far);
    this.time = 0;
    this.params = {
      posX: 45,
      posY: 10,
      posZ: 75,
    }
    this.enableControl = options?.enableControl;
    // this.gui = options?.gui;

    if (!options?.canvas) return;
    if (!this.enableControl) return;
    this.controls = new OrbitControls(this, options?.canvas);
    this.controls.enableDamping = options?.enableDamping || false;
    this.controls.dampingFactor = options?.dampingFactor ?? 0.2;
  }

  init() {
    const {posX, posY, posZ} = this.params;
    this.position.set(posX, posY, posZ);
    this.lookAt(new THREE.Vector3(0, 0, 0));

    // if(this.gui) this.paramSetting();
  }

  resize(resolution) {
    this.aspect = resolution.x / resolution.y;
    this.updateProjectionMatrix();
  }

  update(deltaTime) {
    // const r = 20;
    this.time += deltaTime;
    // this.position.set( Math.sin( this.time * 0.2 ) * r, 10, Math.cos( this.time * 0.2 ) * r );
    // this.lookAt(0, 0, 0);
    if (!this.controls) return;
    this.controls.update();
  }

  // paramSetting() {
  //   this.gui.add(this.setting, 'posX', 0, 100, 1);
  //   this.gui.add(this.setting, 'posY', 0, 100, 1);
  //   this.gui.add(this.setting, 'posZ', 0, 100, 1);
  // }
}
