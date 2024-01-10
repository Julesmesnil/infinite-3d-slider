#include <fog_pars_fragment>

uniform sampler2D uTexture;
uniform float uPositionZ;
            
varying vec2 vUv;
varying float vElevation;

void main() {
    vec4 textureColor = texture2D(uTexture, vUv);
    textureColor.rgb *= vElevation * 4.0 + 0.8;
    gl_FragColor = textureColor;
    gl_FragColor.a = uPositionZ;

    #include <fog_fragment>
}