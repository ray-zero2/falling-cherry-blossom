import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module'
import { GUI } from 'dat.gui';

import Camera from './Camera';
import Petal from './petals/Petal';
import noiseTex from './textures/snoise.png';
import petalTex from './textures/petal.png';

export default class WebGLContent {
  constructor(canvas) {
    this.canvas = canvas;
    this.time = 0;
    this.resolution = {
      x: canvas.offsetWidth,
      y: canvas.offsetHeight
    }
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    this.renderer.domElement.style.width = "100%";
    this.renderer.domElement.style.height = "100%";
    this.scene = new THREE.Scene();
    this.camera = new Camera({
      fov: 50,
      aspect: this.resolution.x / this.resolution.y,
      far: 1000,
      canvas,
      enableControl: true,
      enableDamping: true,
      dampingFactor: 0.05
    });
    this.clock = new THREE.Clock(true);
    this.petal = null;

    this.stats = new Stats()
    this.gui = new GUI();

    this.init().then(this.start.bind(this));
  }

  resize(width, height) {
    console.log('resize');
    this.resolution.x = width;
    this.resolution.y = height;
    this.renderer.setSize(this.resolution.x, this.resolution.y, false);
    this.camera.resize(this.resolution);
  }

  async init() {
    document.body.appendChild(this.stats.dom);
    const { textures } = await this.fetchObjects();
    this.petal = new Petal({
      noiseTexture: textures.noise,
      petalTexture: textures.petal,
      gui: this.gui
    });
    this.petal.position.set(0, 0 ,0);
    this.scene.add(this.petal);
    this.camera.init();
    this.setRenderer();
    this.bind();

    // gridHelper
    const gridHelper = new THREE.GridHelper(200, 50);  // 引数は サイズ、1つのグリッドの大きさ
    this.scene.add(gridHelper);

    // axisHelper
    const axisHelper = new THREE.AxesHelper(1000);  // 引数は 軸のサイズ
    this.scene.add(axisHelper);
  }

  async fetchObjects() {
    const textureLoader = new THREE.TextureLoader();

    return await Promise.all([
      textureLoader.loadAsync(noiseTex),
      textureLoader.loadAsync(petalTex),
    ]).then((response) => {
      const noiseTexture = response[0];
      const petalTexture = response[1];
      noiseTexture.wrapS = THREE.MirroredRepeatWrapping;
      noiseTexture.wrapT = THREE.MirroredRepeatWrapping;
      petalTexture.mipmaps = THREE.LinearMipMapLinearFilter;
      const textures = {
        noise: noiseTexture,
        petal: petalTexture
      }
      return { textures };
    });
  }


  start() {
    this.animate();
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    const deltaTime = this.clock.getDelta();
    this.time += deltaTime;
    this.camera.update(deltaTime);
    this.petal.update(deltaTime);
    this.renderer.render(this.scene, this.camera);
    this.stats.update();
  }

  setRenderer() {
    this.renderer.setSize(this.resolution.x, this.resolution.y, false);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.clearColor('#ffffff');
  }

  handleResize() {
    this.resize(this.canvas.offsetWidth, this.canvas.offsetHeight);
  }

  bind() {
    window.addEventListener('resize', this.handleResize.bind(this));
  }
}
