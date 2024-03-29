#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>

uniform vec3 color;
uniform sampler2D tDiffuse;
uniform sampler2D tDudv;
uniform float uTime;

varying vec4 vUv;

void main() {

	#include <logdepthbuf_fragment>

	float waveStrength = 0.1;
	float waveSpeed = 0.03;

	// simple distortion (ripple) via dudv map (see https://www.youtube.com/watch?v=6B7IF6GOu7s)

	vec2 distortedUv = texture2D( tDudv, vec2( vUv.x + uTime * waveSpeed, vUv.y ) ).rg * waveStrength;
	distortedUv = vUv.xy + vec2( distortedUv.x, distortedUv.y + uTime * waveSpeed );
	vec2 distortion = ( texture2D( tDudv, distortedUv ).rg * 2.0 - 1.0 ) * waveStrength;

	// new uv coords

	vec4 uv = vec4( vUv );
	uv.xy += distortion / 2.0;

	vec4 base = texture2DProj( tDiffuse, uv );
	gl_FragColor = vec4( mix( base.rgb, color, 0.5 ), 1.0 );

	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>

}