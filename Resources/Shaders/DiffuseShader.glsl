#version 300 es
in vec3 vertPosition;
in vec2 vertTexCoord;
in vec2 vertNormal;
in vec2 vertTangent;
uniform mat4 mModel;
uniform mat4 mView;
uniform mat4 mProj;
out vec2 fragTexCoord;

void main() {
    vertNormal;
    vertTangent;
    fragTexCoord = vertTexCoord;
    gl_Position = mProj * mView * mModel * vec4(vertPosition, 1.0);
}

--SPLIT--#version 300 es
 
precision mediump float;
 in vec2 fragTexCoord;
 uniform sampler2D sampler;
 out vec4 color;

 void main() {
 color = texture(sampler, fragTexCoord);
 }