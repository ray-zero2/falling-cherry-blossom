import{P as T,O as z,V as p,M as R,a as B,R as Q,D as E,I as U,b as c,c as L,W as K,S as X,A as j,d as J,G as k,e as H,f as Z,T as O,g as x,L as F}from"./vendor.e857a57e.js";const G=function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))i(t);new MutationObserver(t=>{for(const a of t)if(a.type==="childList")for(const n of a.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&i(n)}).observe(document,{childList:!0,subtree:!0});function r(t){const a={};return t.integrity&&(a.integrity=t.integrity),t.referrerpolicy&&(a.referrerPolicy=t.referrerpolicy),t.crossorigin==="use-credentials"?a.credentials="include":t.crossorigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function i(t){if(t.ep)return;t.ep=!0;const a=r(t);fetch(t.href,a)}};G();class N extends T{constructor(e={}){super(e==null?void 0:e.fov,e==null?void 0:e.aspect,e==null?void 0:e.near,e==null?void 0:e.far);var r;this.time=0,this.params={posX:45,posY:10,posZ:75},this.enableControl=e==null?void 0:e.enableControl,!!(e==null?void 0:e.canvas)&&(!this.enableControl||(this.controls=new z(this,e==null?void 0:e.canvas),this.controls.enableDamping=(e==null?void 0:e.enableDamping)||!1,this.controls.dampingFactor=(r=e==null?void 0:e.dampingFactor)!=null?r:.2))}init(){const{posX:e,posY:r,posZ:i}=this.params;this.position.set(e,r,i),this.lookAt(new p(0,0,0))}resize(e){this.aspect=e.x/e.y,this.updateProjectionMatrix()}update(e){this.time+=e,!!this.controls&&this.controls.update()}}var q=`attribute vec3 position;
attribute vec3 normal;
attribute vec3 offset;
attribute vec3 random;
attribute vec3 rotateRandom;
attribute vec2 texIndex;
attribute vec2 direction;
attribute vec2 uv;
// uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform float time;
uniform float speedX;
uniform float speedY;
uniform float rotateSpeed;
uniform float rotateX;
uniform float rotateY;
uniform float rotateZ;
uniform vec3 range;
// uniform sampler2D noiseTex;
varying vec2 vUv;
varying vec2 vTexIndex;
varying float vOpacity;

mat4 translateMatrix4(vec3 v) {
  return
    mat4(
      1.0, 0.0, 0.0, 0.0,
      0.0, 1.0, 0.0, 0.0,
      0.0, 0.0, 1.0, 0.0,
      v.x, v.y, v.z, 1.0
    );
}

mat4 rotate4X(float r) {
  return
    mat4(
      1.0, 0.0, 0.0, 0.0,
      0.0, cos(r), -sin(r), 0.0,
      0.0, sin(r), cos(r), 0.0,
      0.0, 0.0, 0.0, 1.0
    );
}

mat4 rotate4Y(float r) {
  return
    mat4(
      cos(r), 0.0, sin(r), 0.0,
      0.0, 1.0, 0.0, 0.0,
      -sin(r), 0.0, cos(r), 0.0,
      0.0, 0.0, 0.0, 1.0
    );
}

mat4 rotate4Z(float r) {
  return
    mat4(
      cos(r), -sin(r), 0.0, 0.0,
      sin(r), cos(r), 0.0, 0.0,
      0.0, 0.0, 1.0, 0.0,
      0.0, 0.0, 0.0, 1.0
    );
}

const float PI = 3.14;
const float PI_2 = 3.14 * 2.;
const float PI_HALF = 3.14 / 2.;


void main() {
  vec3 rangeHalf = range / 2.;
  // vec2 noiseUv1 = random.xy;
  // vec2 noiseUv2 = random.yz;

  // vec4 fNoise = texture2D(noiseTex, noiseUv1 - time * .1);
  // vec4 sNoise = texture2D(noiseTex, noiseUv2 - time * .001);
  // fNoise = fNoise * 2. - 1.;
  // sNoise = sNoise * 2. - 1.;

  // calc position
  vec3 petalPos = offset;
  vec2 moving = vec2(
    time * speedX * direction.x,
    time * speedY * direction.y
  );
  petalPos.x = range.x - mod(petalPos.x + rangeHalf.x + moving.x, range.x) - rangeHalf.x;
  petalPos.y = range.y - mod(petalPos.y + rangeHalf.y + moving.y, range.y) - rangeHalf.y;
  petalPos.z += sin(time * random.x / 2. + random.y * PI_2) * 10. * random.z;

  mat4 translateMat = translateMatrix4(petalPos);

  // calc opacity
  float normalizedDistanceX = distance(petalPos.x, 0.) / rangeHalf.x;
  float normalizedDistanceY = distance(petalPos.y, 0.) / rangeHalf.y;
  float dist = max(normalizedDistanceX, normalizedDistanceY);
  float opacity = 1. - smoothstep(0.92, 0.98, dist);


  // rotation
  vec3 initialRotation = (random - .5) * PI_2;
  mat4 rotateSelfMat =
    rotate4Z(time * rotateSpeed * rotateRandom.z * rotateZ + initialRotation.z)
    * rotate4X(time * rotateSpeed * rotateRandom.x * rotateX + initialRotation.x)
    * rotate4Y(time * rotateSpeed * rotateRandom.y * rotateY + initialRotation.y);

  // output
  vec4 petalsPos = translateMat * rotateSelfMat
  * vec4( position, 1.0 );
  gl_Position = projectionMatrix * viewMatrix * petalsPos;
  vOpacity = opacity;
  vUv = uv;
  vTexIndex = texIndex;
}
`,W=`precision highp float;
// uniform float time;
uniform float opacity;
uniform sampler2D petalTex;
varying vec2 vUv;
varying vec2 vTexIndex;
varying float vOpacity;

void main() {
  vec4 petal = texture2D(petalTex, vUv);
  if(petal.a < 0.5) discard;

  petal.a *= opacity;
  petal.a *= vOpacity;

  gl_FragColor = petal;
}
`;const l=5e3,s={speedX:8,speedY:6.5,rotate:{speed:10,rangeX:1,rangeY:1,rangeZ:1},opacity:.8,range:[350,350,350]};class V extends R{constructor(e){const{noiseTexture:r,petalTexture:i}=e,t=new B(2,2),a=new Q({vertexShader:q,fragmentShader:W,side:E,transparent:!0,depthTest:!0,uniforms:{time:{value:0},opacity:{value:s.opacity},speedX:{value:s.speedX},speedY:{value:s.speedY},rotateSpeed:{value:s.rotate.speed},rotateX:{value:s.rotate.rangeX},rotateY:{value:s.rotate.rangeY},rotateZ:{value:s.rotate.rangeZ},petalTex:{value:i},range:{value:new p(...s.range)}}}),n=new U;n.instanceCount=l;const y=t.attributes.position.clone();n.setAttribute("position",y);const M=t.attributes.uv.clone();n.setAttribute("uv",M);const w=t.attributes.normal.clone();n.setAttribute("normal",w);const I=t.index.clone();n.setIndex(I);const d=new c(new Float32Array(l*3),3),m=new c(new Float32Array(l*3),3),f=new c(new Float32Array(l*3),3),h=new c(new Float32Array(l*2),2),g=new c(new Uint16Array(l*2),2);for(let o=0;o<l;o++){const u=a.uniforms.range.value,C=Math.random()*u.x-u.x/2,P=Math.random()*u.y-u.y/2,Y=Math.random()*u.z-u.z/2;d.setXYZ(o,C,P,Y);const S=Math.random()/4,b=Math.random()/4+.75,D=Math.random()/4;m.setXYZ(o,S,b,D),f.setXYZ(o,Math.random(),Math.random(),Math.random());const v=new L(Math.random(),Math.random()*(3/4)+1/4);h.setXY(o,v.x,v.y),g.setXY(o,Math.floor(Math.random()*2),Math.floor(Math.random()*2))}n.setAttribute("offset",d),n.setAttribute("rotateRandom",m),n.setAttribute("random",f),n.setAttribute("direction",h),n.setAttribute("texIndex",g);super(n,a);this.time=0,this.gui=e==null?void 0:e.gui,this.uniformSettings={},this.initSettings()}initSettings(){this.uniformSettings={opacity:this.material.uniforms.opacity.value,speedX:this.material.uniforms.speedX.value,speedY:this.material.uniforms.speedY.value,rotateSpeed:this.material.uniforms.rotateSpeed.value,rotateX:this.material.uniforms.rotateX.value,rotateY:this.material.uniforms.rotateY.value,rotateZ:this.material.uniforms.rotateZ.value},this.gui.add(this.uniformSettings,"speedX",0,30,.1),this.gui.add(this.uniformSettings,"speedY",0,30,.1),this.gui.add(this.uniformSettings,"opacity",.5,1,.01),this.gui.add(this.uniformSettings,"rotateSpeed",0,30,.1),this.gui.add(this.uniformSettings,"rotateX",0,1,.001),this.gui.add(this.uniformSettings,"rotateY",0,1,.001),this.gui.add(this.uniformSettings,"rotateZ",0,1,.001)}update(e){this.time+=e,this.material.uniforms.time.value=this.time,this.material.uniforms.speedX.value=this.uniformSettings.speedX,this.material.uniforms.speedY.value=this.uniformSettings.speedY,this.material.uniforms.opacity.value=this.uniformSettings.opacity,this.material.uniforms.rotateSpeed.value=this.uniformSettings.rotateSpeed,this.material.uniforms.rotateX.value=this.uniformSettings.rotateX,this.material.uniforms.rotateY.value=this.uniformSettings.rotateY,this.material.uniforms.rotateZ.value=this.uniformSettings.rotateZ}}var _="./assets/snoise.8a3a68c0.png",$="data:image/png;base64,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";class ee{constructor(e){this.canvas=e,this.time=0,this.resolution={x:e.offsetWidth,y:e.offsetHeight},this.renderer=new K({canvas:e,alpha:!0,antialias:!0}),this.renderer.domElement.style.width="100%",this.renderer.domElement.style.height="100%",this.scene=new X,this.camera=new N({fov:50,aspect:this.resolution.x/this.resolution.y,far:1e3,canvas:e,enableControl:!0,enableDamping:!0,dampingFactor:.05}),this.petal=null,this.framer=j.getInstance(),this.stats=new J,this.gui=new k,this.gui.closed=!1,this.init().then(this.start.bind(this))}resize(e,r){console.log("resize"),this.resolution.x=e,this.resolution.y=r,this.renderer.setSize(this.resolution.x,this.resolution.y,!1),this.camera.resize(this.resolution)}async init(){document.body.appendChild(this.stats.dom);const{textures:e}=await this.fetchObjects();this.petal=new V({noiseTexture:e.noise,petalTexture:e.petal,gui:this.gui}),this.petal.position.set(0,0,0),this.scene.add(this.petal),this.camera.init({gui:this.gui}),this.setRenderer(),this.bind(),this.framer.add({id:"cherryBlossom",update:this.update.bind(this)});const r=new H(200,50);this.scene.add(r);const i=new Z(1e3);this.scene.add(i)}async fetchObjects(){const e=new O;return await Promise.all([e.loadAsync(_),e.loadAsync($)]).then(r=>{const i=r[0],t=r[1];return i.wrapS=x,i.wrapT=x,t.mipmaps=F,{textures:{noise:i,petal:t}}})}start(){this.framer.start()}update({deltaTime:e}){this.time+=e,this.camera.update(e),this.petal.update(e),this.renderer.render(this.scene,this.camera),this.stats.update()}setRenderer(){this.renderer.setSize(this.resolution.x,this.resolution.y,!1),this.renderer.setPixelRatio(window.devicePixelRatio),this.renderer.clearColor("#ffffff")}handleResize(){this.resize(this.canvas.offsetWidth,this.canvas.offsetHeight)}bind(){window.addEventListener("resize",this.handleResize.bind(this))}}const te=document.querySelector(".js-canvas");new ee(te);
