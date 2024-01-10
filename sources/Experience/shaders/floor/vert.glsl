#include <fog_pars_vertex>
#include <common>
#include <logdepthbuf_pars_vertex>

uniform mat4 textureMatrix;

varying vec4 vUv;

void main() {
	#include <begin_vertex>
    #include <project_vertex>

	vUv = textureMatrix * vec4( position, 1.0 );

	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

	#include <logdepthbuf_vertex>
	#include <fog_vertex>

}