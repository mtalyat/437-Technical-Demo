const POINT_COUNT_AXIS = 50;
const POINT_COUNT = POINT_COUNT_AXIS * POINT_COUNT_AXIS;
const WORLD_WIDTH = 10.0;
const WORLD_POINT_SCALE = WORLD_WIDTH / POINT_COUNT_AXIS;
const WORLD_HEIGHT = 2.0;
const WORLD_SEA_LEVEL = 0.25;
const OCTAVES = 2;
const FREQUENCY_HEIGHT = 2.0;
const FREQUENCY_MOISTURE = 1.0;
const BLEND_COLORS = false;
const BIOMES =
    [
        {
            name: "Snow",
            height: {
                min: 3 / 4,
                max: 1
            },
            moisture: {
                min: 3 / 6,
                max: 1
            },
            color: {
                r: 248 / 255,
                g: 248 / 255,
                b: 248 / 255
            }
        },
        {
            name: "Tundra",
            height: {
                min: 3 / 4,
                max: 1
            },
            moisture: {
                min: 2 / 6,
                max: 3 / 6
            },
            color: {
                r: 142 / 255,
                g: 142 / 255,
                b: 69 / 255
            }
        },
        {
            name: "Bare",
            height: {
                min: 3 / 4,
                max: 1
            },
            moisture: {
                min: 1 / 6,
                max: 2 / 6,
            },
            color: {
                r: 187 / 255,
                g: 187 / 255,
                b: 187 / 255
            }
        },
        {
            name: "Scorched",
            height: {
                min: 3 / 4,
                max: 1
            },
            moisture: {
                min: 0,
                max: 1 / 6
            },
            color: {
                r: 120 / 255,
                g: 120 / 255,
                b: 120 / 255
            }
        },
        {
            name: "Taiga",
            height: {
                min: 2 / 4,
                max: 3 / 4
            },
            moisture: {
                min: 4 / 6,
                max: 1
            },
            color: {
                r: 159 / 255,
                g: 170 / 255,
                b: 137 / 255
            }
        },
        {
            name: "Shrubland",
            height: {
                min: 2 / 4,
                max: 3 / 4
            },
            moisture: {
                min: 2 / 6,
                max: 4 / 6
            },
            color: {
                r: 171 / 255,
                g: 187 / 255,
                b: 152 / 255
            }
        },
        {
            name: "Temperate Desert",
            height: {
                min: 2 / 4,
                max: 3 / 4
            },
            moisture: {
                min: 0,
                max: 2 / 6
            },
            color: {
                r: 209 / 255,
                g: 222 / 255,
                b: 126 / 255
            }
        },
        {
            name: "Temperate Rain Forest",
            height: {
                min: 1 / 4,
                max: 2 / 4
            },
            moisture: {
                min: 5 / 6,
                max: 1
            },
            color: {
                r: 101 / 255,
                g: 191 / 255,
                b: 112 / 255
            }
        },
        {
            name: "Temperate Deciduous Forest",
            height: {
                min: 1 / 4,
                max: 2 / 4
            },
            moisture: {
                min: 3 / 6,
                max: 5 / 6
            },
            color: {
                r: 108 / 255,
                g: 146 / 255,
                b: 89 / 255
            }
        },
        {
            name: "Grassland",
            height: {
                min: 1 / 4,
                max: 2 / 4
            },
            moisture: {
                min: 1 / 6,
                max: 3 / 6
            },
            color: {
                r: 116 / 255,
                g: 142 / 255,
                b: 72 / 255
            }
        },
        {
            name: "Temperate Desert",
            height: {
                min: 1 / 4,
                max: 2 / 4
            },
            moisture: {
                min: 0,
                max: 1 / 6
            },
            color: {
                r: 209 / 255,
                g: 222 / 255,
                b: 126 / 255
            }
        },
        {
            name: "Tropical Rain Forest",
            height: {
                min: 0,
                max: 1 / 4
            },
            moisture: {
                min: 4 / 6,
                max: 1
            },
            color: {
                r: 66 / 255,
                g: 135 / 255,
                b: 95 / 255
            }
        },
        {
            name: "Tropical Seasonal Forest",
            height: {
                min: 0,
                max: 1 / 4
            },
            moisture: {
                min: 2 / 6,
                max: 4 / 6
            },
            color: {
                r: 47 / 255,
                g: 127 / 255,
                b: 35 / 255
            }
        },
        {
            name: "Grassland",
            height: {
                min: 0,
                max: 1 / 4
            },
            moisture: {
                min: 1 / 6,
                max: 2 / 6
            },
            color: {
                r: 116 / 255,
                g: 142 / 255,
                b: 72 / 255
            }
        },
        {
            name: "Subtropical Desert",
            height: {
                min: 0,
                max: 1 / 4
            },
            moisture: {
                min: 0,
                max: 1 / 6
            },
            color: {
                r: 233 / 255,
                g: 221 / 255,
                b: 199 / 255
            }
        }
    ];

// finds the biome based on the given values
function findBiome(height, moisture) {
    for (let biome of BIOMES){
        // check if height and moisture are part of this biome
        if (height >= biome.height.min && height <= biome.height.max && moisture >= biome.moisture.min && moisture <= biome.moisture.max) {
            // biome found
            return biome;
        }
    }

    // none found, odd...
    console.error(`No biome found for height ${height} and moisture ${moisture}.`);
    return null;
}

// use a custom class to randomly generate numbers using a seed
// Math.random() does not allow for a seed
class RandomNumberGenerator {
    constructor(seed) {
        this.seed = seed;
    }

    random() {
        const a = 1664525;
        const c = 1013904223;
        const m = 4294967296; // 2^32
        this.seed = (a * this.seed + c) % m;
        return this.seed / m;
    }
}

// could do a random seed by using Math.random() here
const SEED = 1337;
const RNG = new RandomNumberGenerator(SEED);
const NOISE_HEIGHT = new FastNoiseLite(SEED);
NOISE_HEIGHT.SetFrequency(FREQUENCY_HEIGHT);
const NOISE_MOISTURE = new FastNoiseLite(SEED);
NOISE_MOISTURE.SetFrequency(FREQUENCY_MOISTURE);

// gets the height at the position
function getHeight(x, y) {
    let value = 0;
    let sum = 0;

    for (let i = 0; i < OCTAVES; i++) {
        const j = 1 << i;
        const n = NOISE_HEIGHT.GetNoise(x * j, y * j);
        const amp = 1.0 / (i + 1);
        sum += amp;
        value += amp * n;
    }

    if (sum > 0) value /= sum;
    return value * 0.5 + 0.5; // get between 0 and 1
}

function getHeightIsland(x, y) {
    const height = getHeight(x, y);

    // scale based on distance to center
    const distanceX = x - 0.5;
    const distanceY = y - 0.5;
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

    // max distance to corner is always distance from (0, 0) to (0.5, 0.5), which is sqrt(0.5) simplified
    return height * (1.0 - (distance / Math.sqrt(0.5)));
}

function getMoisture(x, y) {
    return NOISE_MOISTURE.GetNoise(x, y) * 0.5 + 0.5;
}

// gets the color at the position based on the height and moisture
function getColor(height, moisture, x, y) {
    // if height below sea level, return water color, based on depth
    if(height <= WORLD_SEA_LEVEL){
        const depth = (1 -((WORLD_SEA_LEVEL - height) / WORLD_SEA_LEVEL)) * 0.5 + 0.5;
        return {
            r: 28/255*depth,
            g: 30/255*depth,
            b: 79/255*depth,
        }
    }

    // find the biome
    const biome = findBiome(height, moisture);

    if (!biome) return { r: 0, g: 0, b: 0 };

    // use biome color
    return {
        r: biome.color.r * 1,
        g: biome.color.g * 1,
        b: biome.color.b * 1
    };
}

// holds functions for generating the terrain
const GENERATOR = {
    getHeight: getHeightIsland,
    getMoisture: getMoisture,
    getColor: getColor,
};

// generates a position and color data for each point on the map
function generateMap() {
    function generateRandomPoints(numPoints) {
        let points = [];
        for (let i = 0; i < numPoints; i++) {
            points.push({
                x: RNG.random(),
                y: RNG.random()
            });
        }
        return points;
    }

    function createInitialCentroids(step) {
        let centroids = [];
        for (let x = step / 2; x <= 1; x += step) {
            for (let y = step / 2; y <= 1; y += step) {
                centroids.push({
                    x: Math.min(Math.max(x + step / 2, 0), 1),  // Clamp values to [0, 1]
                    y: Math.min(Math.max(y + step / 2, 0), 1)   // Clamp values to [0, 1]
                });
            }
        }
        return centroids;
    }

    function assignPointsToCentroids(points, centroids) {
        let clusters = new Array(centroids.length).fill().map(() => []);
        points.forEach(point => {
            let minDistance = Infinity;
            let closestIndex = -1;
            centroids.forEach((centroid, index) => {
                let distance = Math.pow(centroid.x - point.x, 2) + Math.pow(centroid.y - point.y, 2);
                if (distance < minDistance) {
                    minDistance = distance;
                    closestIndex = index;
                }
            });
            clusters[closestIndex].push(point);
        });
        return clusters;
    }

    function updateCentroids(clusters, centroids) {
        return clusters.map((cluster, index) => {
            if (cluster.length === 0) {
                return centroids[index];
            }
            let sumX = 0, sumY = 0;
            cluster.forEach(point => {
                sumX += point.x;
                sumY += point.y;
            });
            let newX = sumX / cluster.length;
            let newY = sumY / cluster.length;
            // Optionally clamp the centroids to [0, 1] if they drift out due to initial boundary extension
            return {
                x: Math.min(Math.max(newX, 0), 1),
                y: Math.min(Math.max(newY, 0), 1)
            };
        });
    }

    function lloydsAlgorithm(points, step, iterations) {
        let centroids = createInitialCentroids(step);
        for (let i = 0; i < iterations; i++) {
            let clusters = assignPointsToCentroids(points, centroids);
            centroids = updateCentroids(clusters, centroids); // Update to keep previous centroids
        }
        return centroids;
    }

    function generateHeight(x, y){
        // get height and clamp it with sea level
        const height = GENERATOR.getHeight(x, y);
        return Math.max(WORLD_SEA_LEVEL, height);
    }

    const points = generateRandomPoints(POINT_COUNT);
    const centroids = lloydsAlgorithm(points, 1.0 / POINT_COUNT_AXIS, 2);
    const polygonCenters = [];
    centroids.forEach((item) => {
        polygonCenters.push([
            item.x, item.y
        ]);
    });

    const width = 1;
    const height = 1;

    // Create the Delaunay triangulation and then the Voronoi diagram
    const delaunay = d3.Delaunay.from(polygonCenters);
    const voronoi = delaunay.voronoi([0, 0, width, height]);

    // Get the vertices of each Voronoi cell
    const polygons = polygonCenters.map((_, i) => voronoi.cellPolygon(i));

    const nodes = [];
    const heights = new Map();

    // create the mesh from the polygons
    polygons.forEach((polygon) => {
        // skip if not a polygon
        if (!polygon) {
            console.error("Polygon is null.");
            return;
        }

        // skip if not enough points for a triangle
        if (polygon.length < 3) {
            console.error("Polygon has less than 3 points.");
            return;
        }

        // find center
        let center = {
            x: 0,
            y: 0
        };
        const points = [];
        polygon.forEach(([x, y]) => {
            // create point
            const point = {
                x: x,
                y: y
            };
            points.push(point);
            heights.set(point, generateHeight(point.x, point.y) * WORLD_HEIGHT);

            // add to center
            center.x += x;
            center.y += y;
        });
        center.x /= polygon.length;
        center.y /= polygon.length;

        // set height for center and each point, if needed
        // center should not exist so just set it
        heights.set(center, generateHeight(center.x, center.y) * WORLD_HEIGHT);
        
        const height = GENERATOR.getHeight(center.x, center.y);
        const moisture = GENERATOR.getMoisture(center.x, center.y);

        nodes.push({
            points: points,
            center: center,
            height: height,
            moisture: moisture
        });
    });

    return {
        nodes: nodes,
        heights: heights
    };
}

function generateMesh(map) {
    // take the polygon data and average out the color per each polygon per each point
    const colors = new Map(); //  { value, count } pairs

    function addColor(position, color) {
        const key = `x${position.x}y${position.y}z${position.z}`
        if (colors.has(key)) {
            // add to existing
            data = colors.get(key);
            colors.set(key, {
                color: {
                    r: data.color.r + color.r,
                    g: data.color.g + color.g,
                    b: data.color.b + color.b
                },
                count: data.count + 1
            });
        } else {
            // add new
            colors.set(key, {
                color: color,
                count: 1
            });
        }
    }

    map.nodes.forEach((node) => {
        // add points
        node.points.forEach((point) => {
            addColor(point, GENERATOR.getColor(node.height, node.moisture, node.center.x, node.center.y));
        });
    });

    // average the colors based on the counts
    colors.forEach((data) => {
        data.color.r = data.color.r / data.count;
        data.color.g = data.color.g / data.count;
        data.color.b = data.color.b / data.count;
    });

    function getColor(position) {
        return colors.get(`x${position.x}y${position.y}z${position.z}`).color;
    }

    function getHeight(position) {
        const height = map.heights.get(position)
        return Math.max(WORLD_SEA_LEVEL, height);
    }

    let index = 0;
    const vertices = [];
    const indices = [];

    // create the mesh from the polygons
    map.nodes.forEach((node) => {
        // add center
        vertices.push(node.center.x * WORLD_WIDTH, getHeight(node.center), node.center.y * WORLD_WIDTH);

        let color = GENERATOR.getColor(node.height, node.moisture, node.center.x, node.center.y);
        vertices.push(color.r, color.g, color.b);

        // create mesh by triangulating the vertices
        for (let i = 0; i < node.points.length; i++) {
            // add side
            vertices.push(node.points[i].x * WORLD_WIDTH, getHeight(node.points[i]), node.points[i].y * WORLD_WIDTH);
            if (BLEND_COLORS) {
                color = getColor(node.points[i]);
            }

            vertices.push(color.r, color.g, color.b);

            // add indices for the triangle
            indices.push(index);
            indices.push(index + 1 + i);
            indices.push(index + 1 + (i + 1) % node.points.length);
        }

        // increment the index
        index += 1 + node.points.length;
    });

    return {
        vertices: vertices,
        indices: indices
    };
}

// generate the map data
const map = generateMap();

// turn it into a mesh
const mesh = generateMesh(map);

// set the mesh to render
setObjectMesh(mesh);

// render it
render();