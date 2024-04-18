const WORLD_WIDTH = 10.0;
const WORLD_WIDTH_HALF = WORLD_WIDTH * 0.5;
const WORLD_HEIGHT = 2.0;
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
    for (let biome of BIOMES) {
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

// gets the height at the position
function getHeight(noise, x, y) {
    return noise.GetNoise(x, y) * 0.5 + 0.5; // get between 0 and 1
}

function getHeightIsland(noise, x, y) {
    const height = getHeight(noise, x, y);

    // scale based on distance to center
    const distanceX = x - 0.5;
    const distanceY = y - 0.5;
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
    const normalizedDistance = (1.0 - (distance / Math.sqrt(0.25)));

    // get max and min range based on the distance to the center
    // when in center, min is water level
    // when on edge, max is water level
    const min = sessionData.seaLevel * normalizedDistance;
    const max = (1 - sessionData.seaLevel) * normalizedDistance + sessionData.seaLevel;

    // now move to in that range
    return height * (max - min) + min;
}

function getMoisture(noise, x, y) {
    return noise.GetNoise(x, y) * 0.5 + 0.5;
}

// gets the color at the position based on the height and moisture
function getColor(height, moisture, rng) {
    // if height below sea level, return water color, based on depth
    if (height <= sessionData.seaLevel) {
        const depth = (1 - ((sessionData.seaLevel - height) / sessionData.seaLevel)) * 0.5 + 0.5;
        return {
            r: 28 / 255 * depth,
            g: 30 / 255 * depth,
            b: 79 / 255 * depth,
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

function getColorHeight(height, moisture, rng) {
    // just use height for a black -> white gradient
    const value = height * 0.9 + 0.1;
    return {
        r: value,
        g: value,
        b: value
    };
}

function getColorMoisture(height, moisture, rng) {
    // just use moisture for a black -> white gradient
    const value = moisture * 0.9 + 0.1;
    return {
        r: value,
        g: value,
        b: value
    };
}

function getColorRandom(height, moisture, rng) {
    return {
        r: rng.random(),
        g: rng.random(),
        b: rng.random()
    };
}

// generates a position and color data for each point on the map
function generateMap() {
    const rng = new RandomNumberGenerator(sessionData.seed);
    const heightNoise = new FastNoiseLite(sessionData.seed);
    heightNoise.SetNoiseType(sessionData.noiseType);
    heightNoise.SetFrequency(sessionData.heightFrequency);
    heightNoise.SetFractalType(sessionData.fractalType);
    heightNoise.SetFractalOctaves(sessionData.octaves);
    heightNoise.SetFractalLacunarity(sessionData.lacunarity);
    heightNoise.SetFractalGain(sessionData.gain);
    const moistureNoise = new FastNoiseLite(sessionData.seed);
    moistureNoise.SetNoiseType(sessionData.noiseType);
    moistureNoise.SetFrequency(sessionData.moistureFrequency);

    function generateRandomPoints(numPoints) {
        let points = [];
        for (let i = 0; i < numPoints; i++) {
            points.push({
                x: rng.random(),
                y: rng.random()
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

    function generateHeight(x, y) {
        // get height and clamp it with sea level
        const height = sessionData.getHeightFunction(heightNoise, x, y);
        return Math.max(sessionData.seaLevel, height);
    }

    const points = generateRandomPoints(sessionData.detail * sessionData.detail);
    const centroids = lloydsAlgorithm(points, 1.0 / sessionData.detail, sessionData.polygonIterations);
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

        const height = sessionData.getHeightFunction(heightNoise, center.x, center.y);
        const moisture = sessionData.getMoistureFunction(moistureNoise, center.x, center.y);

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
    const rng = new RandomNumberGenerator(sessionData.seed);

    function getHeight(position) {
        const height = map.heights.get(position)
        return Math.max(sessionData.seaLevel, height);
    }

    // given 3 positions, calculates the normal vector
    function calculateNormal(a, b, c) {
        let p1 = [a.x, a.y, a.z];
        let p2 = [b.x, b.y, b.z];
        let p3 = [c.x, c.y, c.z];

        let v1 = [p2[0] - p1[0], p2[1] - p1[1], p2[2] - p1[2]];
        let v2 = [p3[0] - p1[0], p3[1] - p1[1], p3[2] - p1[2]];

        // cross product
        let nx = v1[1] * v2[2] - v1[2] * v2[1];
        let ny = v1[2] * v2[0] - v1[0] * v2[2];
        let nz = v1[0] * v2[1] - v1[1] * v2[0];

        // normalize the normal vector
        let length = Math.sqrt(nx * nx + ny * ny + nz * nz);
        return { x: nx / length, y: ny / length, z: nz / length };
    }

    let index = 0;
    const vertices = [];
    const indices = [];

    // create the mesh from the polygons
    map.nodes.forEach((node) => {
        const color = sessionData.getColorFunction(node.height, node.moisture, rng);

        const center = {
            x: node.center.x * WORLD_WIDTH - WORLD_WIDTH_HALF,
            y: getHeight(node.center),
            z: node.center.y * WORLD_WIDTH - WORLD_WIDTH_HALF
        };

        // create mesh by triangulating the vertices
        for (let i = 0; i < node.points.length; i++) {
            // get previous index to calculate normals
            const j = (i - 1 + node.points.length) % node.points.length;

            // vertex positions
            const position1 = {
                x: node.points[i].x * WORLD_WIDTH - WORLD_WIDTH_HALF,
                y: getHeight(node.points[i]),
                z: node.points[i].y * WORLD_WIDTH - WORLD_WIDTH_HALF
            }
            const position2 = {
                x: node.points[j].x * WORLD_WIDTH - WORLD_WIDTH_HALF,
                y: getHeight(node.points[j]),
                z: node.points[j].y * WORLD_WIDTH - WORLD_WIDTH_HALF
            }
            const normal = calculateNormal(center, position1, position2);

            vertices.push(center.x, center.y, center.z, color.r, color.g, color.b, normal.x, normal.y, normal.z);
            vertices.push(position1.x, position1.y, position1.z, color.r, color.g, color.b, normal.x, normal.y, normal.z);
            vertices.push(position2.x, position2.y, position2.z, color.r, color.g, color.b, normal.x, normal.y, normal.z);

            // add indices for the triangle
            indices.push(index);
            indices.push(index + 1);
            indices.push(index + 2);
            index += 3;
        }
    });

    return {
        vertices: vertices,
        indices: indices
    };
}