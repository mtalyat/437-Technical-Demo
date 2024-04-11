const canvas = document.getElementById('canvas');
const gl = canvas.getContext('webgl2');

const vertexSource = `#version 300 es
in vec4 aPosition;
in vec4 aColor;
uniform mat4 uObjectMatrix;
uniform mat4 uProjectionMatrix;
out vec3 color;

void main() {
    gl_Position = uProjectionMatrix * uObjectMatrix * aPosition;
    color = aColor.xyz;
}
`;

const fragmentSource = `#version 300 es
precision mediump float;
in vec3 color;
out vec4 outColor;

void main() {
    outColor = vec4(color, 1.0);
}
`;

// given the instance to webgl, the type, and the source code: compiles a shader and returns it
function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('An error occurred compiling the shaders:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

function createShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource);

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.error('Unable to initialize the shader program:', gl.getProgramInfoLog(shaderProgram));
        return null;
    }

    return shaderProgram;
}

const shaderProgram = createShaderProgram(gl, vertexSource, fragmentSource);

const programInfo = {
    program: shaderProgram,
    attributes: {
        vertexPosition: gl.getAttribLocation(shaderProgram, 'aPosition'),
        colorPosition: gl.getAttribLocation(shaderProgram, 'aColor'),
    },
    uniforms: {
        projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
        objectMatrix: gl.getUniformLocation(shaderProgram, 'uObjectMatrix')
    }
};

// resizes the canvas if needed, returns true if it did
function resizeCanvasToDisplaySize(canvas) {
    const displayWidth = Math.floor(canvas.clientWidth * window.devicePixelRatio);
    const displayHeight = Math.floor(canvas.clientHeight * window.devicePixelRatio);

    // if canvas is not the same size as the display, resize it
    if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        return true;
    }

    return false;
}

function createVertexBuffer(array)
{
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(array), gl.STATIC_DRAW);
    return buffer;
}

function createIndexBuffer(array)
{
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(array), gl.STATIC_DRAW);
    return buffer;
}

const vertices = [
    0.0, 1.0, 0.0, 1.0, 0.0, 0.0,
    -1.0, -1.0, 0.0, 0.0, 1.0, 0.0,
    1.0, -1.0, 0.0, 0.0, 0.0, 1.0
];

const indices = [
    0, 1, 2
];

const vertexBuffer = createVertexBuffer(vertices);
const indexBuffer = createIndexBuffer(indices);

const noise = new FastNoiseLite();

// gets the height at the position
function getHeight(noise, x, y)
{

}

// gets the color at the position
function getColor(noise, x, y)
{

}

// generates a position and color data for a point on the map
function generatePoint(x, y)
{

}

const map = {

};

// call this to render to the screen
function render() {
    // resize the canvas to the display size (if necessary)
    if (resizeCanvasToDisplaySize(gl.canvas)) {
        // adjust WebGL viewport to new canvas size
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    }

    const fov = 45 * Math.PI / 180;
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const near = 0.1;
    const far = 100.0;
    const projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, fov, aspect, near, far);

    const objectMatrix = mat4.create();
    mat4.translate(objectMatrix, objectMatrix, [0.0, 0.0, -6.0]);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(programInfo.program);

    gl.uniformMatrix4fv(programInfo.uniforms.projectionMatrix, false, projectionMatrix);
    gl.uniformMatrix4fv(programInfo.uniforms.objectMatrix, false, objectMatrix);

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.vertexAttribPointer(programInfo.attributes.vertexPosition, 3, gl.FLOAT, false, 24, 0);
    gl.enableVertexAttribArray(programInfo.attributes.vertexPosition);
    gl.vertexAttribPointer(programInfo.attributes.colorPosition, 3, gl.FLOAT, false, 24, 12);
    gl.enableVertexAttribArray(programInfo.attributes.colorPosition);

    // gl.drawArrays(gl.TRIANGLES, 0, 6);
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
    
    // // keep drawing every frame
    // window.requestAnimationFrame(render);
}

render();