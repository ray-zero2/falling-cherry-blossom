import * as THREE from 'three';
import petalVert from './shaders/petal.vs?raw';
import petalFrag from './shaders/petal.fs?raw';

const NUM = 5000;
const PARAMS = {
  speedX: 8,
  speedY: 6.5,
  rotate: {
    speed: 10,
    rangeX: 1,
    rangeY: 1,
    rangeZ: 1
  },
  opacity: 0.8,
  range: [350, 350, 350]
}

export default class Petal extends THREE.Mesh{
  constructor(options) {
    const { noiseTexture, petalTexture } = options;
    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.RawShaderMaterial({
      vertexShader: petalVert,
      fragmentShader: petalFrag,
      side: THREE.DoubleSide,
      transparent: true,
      depthTest: true,
      uniforms: {
        time: { value: 0 },
        opacity: { value: PARAMS.opacity },
        speedX: { value: PARAMS.speedX },
        speedY: { value: PARAMS.speedY },
        rotateSpeed: { value: PARAMS.rotate.speed },
        rotateX: { value: PARAMS.rotate.rangeX },
        rotateY: { value: PARAMS.rotate.rangeY },
        rotateZ: { value: PARAMS.rotate.rangeZ },
        petalTex: {value: petalTexture},
        // noiseTex: {value: noiseTexture},
        range: {
          value: new THREE.Vector3(...PARAMS.range)
        }
      }
    });

    const instancedGeometry = new THREE.InstancedBufferGeometry();
    instancedGeometry.instanceCount = NUM;

    const position = geometry.attributes.position.clone();
    instancedGeometry.setAttribute('position', position);

    const uv = geometry.attributes.uv.clone();
    instancedGeometry.setAttribute('uv', uv);

    const normal = geometry.attributes.normal.clone();
    instancedGeometry.setAttribute('normal', normal);

    const indices = geometry.index.clone();
    instancedGeometry.setIndex(indices);

    const offset = new THREE.InstancedBufferAttribute(
      new Float32Array(NUM * 3),
      3
    );
    const rotateRandom = new THREE.InstancedBufferAttribute(
      new Float32Array(NUM * 3),
      3
    );
    const random = new THREE.InstancedBufferAttribute(
      new Float32Array(NUM * 3),
      3
    );
    const direction = new THREE.InstancedBufferAttribute(
      new Float32Array(NUM * 2),
      2
    );
    const texIndex = new THREE.InstancedBufferAttribute(
      new Uint16Array(NUM * 2),
      2
    );

    for (let i = 0; i < NUM; i++) {
      const range = material.uniforms.range.value;
      const x = Math.random() * range.x - range.x / 2;
      const y = Math.random() * range.y - range.y / 2;
      const z = Math.random() * range.z - range.z / 2;
      offset.setXYZ(i, x, y, z);

      const rotateRangeX = Math.random() / 4;
      const rotateRangeY = Math.random() / 4 + 0.75;
      const rotateRangeZ = Math.random() / 4;
      rotateRandom.setXYZ(i, rotateRangeX, rotateRangeY, rotateRangeZ);

      random.setXYZ(i, Math.random(), Math.random(), Math.random());

      const directionVec2 = new THREE.Vector2(
        Math.random(),
        Math.random() * (3 / 4) + 1 / 4
      );
      direction.setXY(i, directionVec2.x, directionVec2.y);

      texIndex.setXY(
        i,
        Math.floor(Math.random() * 2),
        Math.floor(Math.random() * 2)
      );
    }

    instancedGeometry.setAttribute('offset', offset);
    instancedGeometry.setAttribute('rotateRandom', rotateRandom);
    instancedGeometry.setAttribute('random', random);
    instancedGeometry.setAttribute('direction', direction);
    instancedGeometry.setAttribute('texIndex', texIndex);

    super(instancedGeometry, material);

    this.time = 0;
    this.gui = options?.gui;
    this.uniformSettings = {};
    this.initSettings();
  }

  initSettings() {
    this.uniformSettings = {
      opacity: this.material.uniforms.opacity.value,
      speedX: this.material.uniforms.speedX.value,
      speedY: this.material.uniforms.speedY.value,
      rotateSpeed: this.material.uniforms.rotateSpeed.value,
      rotateX: this.material.uniforms.rotateX.value,
      rotateY: this.material.uniforms.rotateY.value,
      rotateZ: this.material.uniforms.rotateZ.value
    };
    this.gui.add(this.uniformSettings, 'speedX', 0, 30, 0.1);
    this.gui.add(this.uniformSettings, 'speedY', 0, 30, 0.1);
    this.gui.add(this.uniformSettings, 'opacity', 0.5, 1, 0.01);
    this.gui.add(this.uniformSettings, 'rotateSpeed', 0, 30, 0.1);
    this.gui.add(this.uniformSettings, 'rotateX', 0, 1, 0.001);
    this.gui.add(this.uniformSettings, 'rotateY', 0, 1, 0.001);
    this.gui.add(this.uniformSettings, 'rotateZ', 0, 1, 0.001);
  }

  update(deltaTime) {
    this.time += deltaTime;
    this.material.uniforms.time.value = this.time;
    this.material.uniforms.speedX.value = this.uniformSettings.speedX;
    this.material.uniforms.speedY.value = this.uniformSettings.speedY;
    this.material.uniforms.opacity.value = this.uniformSettings.opacity;
    this.material.uniforms.rotateSpeed.value = this.uniformSettings.rotateSpeed;
    this.material.uniforms.rotateX.value = this.uniformSettings.rotateX;
    this.material.uniforms.rotateY.value = this.uniformSettings.rotateY;
    this.material.uniforms.rotateZ.value = this.uniformSettings.rotateZ;
  }
}
