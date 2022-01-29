precision highp float;
// uniform float time;
uniform sampler2D petalTex;
varying vec2 vUv;

void main() {
  vec4 petal = texture2D(petalTex, vUv);
  if(petal.a < 0.01) {
    discard;
  }
  gl_FragColor = petal;
}
