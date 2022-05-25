attribute vec3 position;
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
