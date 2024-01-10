#include <fog_pars_vertex>

uniform vec2 uFrequency;
uniform float uTime;
uniform float uVelocity;
            
varying vec2 vUv;
varying float vElevation;
            
void main() {
    #include <begin_vertex>
    #include <project_vertex>
    
    vUv = uv;
    vec3 modelPosition = position;
                
    float elevation = sin(uTime - position.x * uFrequency.x + position.y * uFrequency.y) * 0.1;
    modelPosition.z += elevation / 3.;
                
    float dstCenter = distance(vec3(0.), modelPosition);
    float pinch = clamp(uVelocity * .2 * dstCenter, -.5, .5);

    modelPosition.z += pinch;
                
    vElevation = elevation;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(modelPosition, 1.);
    
    #include <fog_vertex>
}