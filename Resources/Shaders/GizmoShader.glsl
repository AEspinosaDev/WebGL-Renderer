#version 300 es
in vec3 vertPosition;

uniform mat4 mModel;
uniform mat4 mView;
uniform mat4 mProj;


void main() {

    gl_Position = mProj * mView * mModel * vec4(vertPosition, 1.0);
}

--SPLIT--#version 300 es

precision mediump float;

uniform vec3 lightColor;
uniform float lightIntensity;

out vec4 fragColor;


void main() {
fragColor = vec4(1.0,1.0,1.0,1.0);
    
}
