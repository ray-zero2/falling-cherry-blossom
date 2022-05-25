precision highp float;
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
