attribute vec3 position;
attribute vec3 normal;
attribute vec3 offset;
attribute vec3 random;
attribute vec2 uv;
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform float time;
uniform vec3 range;
uniform sampler2D noiseTex;
varying vec2 vUv;

//rotate
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

mat4 rotateMatrix4(vec3 r) {
  return
    rotate4X(r.x)
      * rotate4Y(r.y)
      * rotate4Z(r.z);
}


// translate
mat4 translateMatrix4(vec3 v) {
  return
    mat4(
      1.0, 0.0, 0.0, 0.0,
      0.0, 1.0, 0.0, 0.0,
      0.0, 0.0, 1.0, 0.0,
      v.x, v.y, v.z, 1.0
    );
}

void main() {
  vUv = uv;

  vec2 noiseUv1 = random.xy;
  vec2 noiseUv2 = random.yz;

  vec4 fNoise = texture2D(noiseTex, noiseUv1 - time * .1);
  vec4 sNoise = texture2D(noiseTex, noiseUv2 - time * .001);
  fNoise = fNoise * 2. - 1.; // noiseの値を -1 ~ 1の範囲に変更
  sNoise = sNoise * 2. - 1.; // noiseの値を -1 ~ 1の範囲に変更

  vec3 pos = position;
  // pos.y = mod(position.y, range.y/2.) ;
  mat4 translateMat = translateMatrix4(offset);
  mat4 rotateSelfMat = rotateMatrix4(vec3(360. * sNoise.r, 360. * sNoise.g, 360. * sNoise.b));
  vec4 mPos = modelMatrix * translateMat * rotateSelfMat * vec4( pos, 1.0 );
  mPos.x = range.x - mod(mPos.x + range.x / 2. + time * 5. * random.x , range.x) - range.x / 2.;
  mPos.y = range.y - mod(mPos.y + range.y / 2. + time * 5. * random.y , range.y) - range.y / 2.;

  gl_Position = projectionMatrix * viewMatrix * mPos;
}
