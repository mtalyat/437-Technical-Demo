const POINT_COUNT = 200;
const WORLD_WIDTH = 10.0;
const WORLD_WIDTH_PER_POINT = WORLD_WIDTH / POINT_COUNT;
const WORLD_HEIGHT = 2.0;
const FREQUENCY = 0.01;

// gets the height at the position
function getHeight(noise, x, y) {
    return noise.GetNoise(x, y) * 0.5 + 0.5;
}

// gets the color at the position
function getColor(noise, x, y) {
    const value = noise.GetNoise(x, y) * 0.5 + 0.5;
    return {
        r: value,
        g: value,
        b: value
    };
}

// generates a position and color data for each point on the map
function generateMap(seed = 1337) {
    let list = [];

    const heightNoise = new FastNoiseLite(seed);
    heightNoise.SetNoiseType(FastNoiseLite.NoiseType.OpenSimplex2);
    heightNoise.SetFrequency(FREQUENCY);

    const colorNoise = new FastNoiseLite(seed);
    colorNoise.SetNoiseType(FastNoiseLite.NoiseType.OpenSimplex2);
    colorNoise.SetFrequency(FREQUENCY);

    // generate the data for each point
    for (let y = 0; y < POINT_COUNT; y++) {
        for (let x = 0; x < POINT_COUNT; x++) {
            list.push({
                position: {
                    // x: x,
                    // y: ,
                    // z: y,
                    x: x * WORLD_WIDTH_PER_POINT,
                    y: getHeight(heightNoise, x, y) * WORLD_HEIGHT,
                    z: y * WORLD_WIDTH_PER_POINT,
                },
                color: getColor(colorNoise, x, y),
            });
        }
    }

    // turn it into a mesh
    const vertices = [];
    const indices = [];

    // add all the vertices
    list.forEach(function(item, index, array){
        vertices.push(item.position.x, item.position.y, item.position.z);
        vertices.push(item.color.r, item.color.g, item.color.b);
    });
    
    // add the indices, each set of 2 triangles should be [(x, y), (x, y + 1), (x + 1, y)], [(x + 1, y), (x, y + 1), (x + 1, y + 1)]
    for (let y = 0; y < POINT_COUNT - 1; y++) {
        for (let x = 0; x < POINT_COUNT - 1; x++) {
            // calculate indices
            const i = y * POINT_COUNT + x;
            const ix = i + 1;
            const iy = i + POINT_COUNT;
            const ixy = iy + 1;

            // add indices to array
            indices.push(i, iy, ix, ix, iy, ixy);
        }
    }

    return {
        points: list,
        mesh: {
            vertices: vertices,
            indices: indices
        }
    };
}

// debug
const map = generateMap(Math.floor(Math.random() * 10001));

setObjectMesh(map.mesh);

render();