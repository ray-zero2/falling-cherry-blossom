import * as THREE from 'three';
import petalVert from './shaders/petal.vs?raw';
import petalFrag from './shaders/petal.fs?raw';

const NUM = 400;

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
        petalTex: {value: petalTexture},
        noiseTex: {value: noiseTexture},
        range: { value: new THREE.Vector3(200, 200, 50) }
      }
    });

    const instancedGeometry = new THREE.InstancedBufferGeometry();
    instancedGeometry.instanceCount = NUM;

    console.log({geometry});

    const position = geometry.attributes.position.clone();
    instancedGeometry.setAttribute('position', position);

    const uv = geometry.attributes.uv.clone();
    instancedGeometry.setAttribute('uv', uv);

    const normal = geometry.attributes.normal.clone();
    instancedGeometry.setAttribute('normal', normal);

    const indices = geometry.index.clone();
    instancedGeometry.setIndex(indices);

    const offset = new THREE.InstancedBufferAttribute(new Float32Array(NUM * 3), 3 );
    const random = new THREE.InstancedBufferAttribute(new Float32Array(NUM * 3), 3 );
    // const texIndex = new THREE.InstancedBufferAttribute(new Uint16Array(NUM*2), 2);
    for(let i = 0; i < NUM; i++) {
      const range = material.uniforms.range.value;
      const  x = Math.random() * range.x - range.x / 2;
      const  y = Math.random() * range.y - range.y / 2;
      const  z = Math.random() * range.z - range.z / 2;
      offset.setXYZ(i, x, y, z);
      random.setXYZ(i, Math.random(), Math.random(), Math.random());
      // texIndex.setXY(i, 1, 1);
    }
    instancedGeometry.setAttribute('offset', offset);
    instancedGeometry.setAttribute('random', random);
    // instancedGeometry.setAttribute('texIndex', texIndex);

    super(instancedGeometry, material);
    // super(geometry, material);
    this.time = 0;
    this.gui = options?.gui;
  }

  update(deltaTime) {
    this.time += deltaTime;
    this.material.uniforms.time.value = this.time;
  }
}
