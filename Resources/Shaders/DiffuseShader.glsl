#version 300 es
in vec3 vertPosition;
in vec2 vertTexCoord;
in vec3 vertNormal;
in vec3 vertTangent;

uniform mat4 mModel;
uniform mat4 mView;
uniform mat4 mProj;
uniform vec3 lightPos;

out vec2 fragTexCoord;
out vec3 fragPos;
out vec3 fragNormal;
out vec3 fragTangent;
out vec3 lightViewPos;

void main() {
    mat4 modelView = mView * mModel;

    fragTexCoord = vertTexCoord;
    fragPos = (modelView * vec4(vertPosition, 1.0)).xyz;
    fragNormal = mat3(transpose(inverse(modelView))) * vertNormal;
    fragTangent = mat3(transpose(inverse(modelView))) * vertTangent;
    lightViewPos = (mView * vec4(lightPos, 1.0)).xyz;

    gl_Position = mProj * mView * mModel * vec4(vertPosition, 1.0);
}

--SPLIT--#version 300 es

precision mediump float;

in vec2 fragTexCoord;
in vec3 fragPos;
in vec3 fragNormal;
in vec3 fragTangent;
in vec3 lightViewPos;

uniform sampler2D albedoText;
uniform sampler2D normalText;
uniform sampler2D specularText;

uniform vec3 lightColor;
uniform float lightIntensity;


//Powers
uniform float Sa;
uniform float Sd;
uniform float Ss;
float shininess = 8.0; //this should be a shininess texture

out vec4 fragColor;



vec4 computePointLight();
vec4 blinnPhongShade(vec3 N, vec3 D, vec3 H);

void main() {
fragColor = computePointLight();
}

vec4 computePointLight() {
    vec3 lightDir = normalize(lightViewPos-fragPos);
    vec3 viewDir = normalize(-fragPos);
    vec3 halfway = normalize(lightDir-viewDir);

   return blinnPhongShade(fragNormal,lightDir,halfway);
}
vec4 blinnPhongShade(vec3 N, vec3 D, vec3 H) {
    vec3 Ka = texture(albedoText, fragTexCoord).xyz;
    vec3 Kd = Ka;
    float Ks = texture(specularText, fragTexCoord).x;
    vec3 Kn = texture(albedoText, fragTexCoord).xyz;

    vec3 ambient = Ka*0.2*lightColor;

    float lambertian = max(dot(N, D), 0.0);
    vec3 diffuse = lambertian * Kd*lightColor;

    float specularFactor = pow(max(dot(N, H), 0.0), shininess);
    vec3 specular = specularFactor * Ks * lightColor;


return vec4((ambient+diffuse+specular),1.0)*lightIntensity;

}
