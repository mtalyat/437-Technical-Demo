const POINT_COUNT_AXIS = 50;
const POINT_COUNT = POINT_COUNT_AXIS * POINT_COUNT_AXIS;
const WORLD_WIDTH = 10.0;
const WORLD_POINT_SCALE = WORLD_WIDTH / POINT_COUNT_AXIS;
const WORLD_HEIGHT = 2.0;
const WORLD_WATER_LEVEL = 0.5;
const OCTAVES = 2;
const FREQUENCY = 2.0;
const BLEND_COLORS = false;

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
NOISE_HEIGHT.SetFrequency(FREQUENCY);

// gets the height at the position
function getHeight(x, y) {
    let value = 0;
    let sum = 0;

    for(let i = 0; i < OCTAVES; i++){
        const j = 1 << i;
        const n = NOISE_HEIGHT.GetNoise(x * j, y * j);
        const amp = 1.0 / (i + 1);
        sum += amp;
        value += amp * n;
    }

    if(sum > 0) value /= sum;
    return (value * 0.5 + 0.5) * WORLD_HEIGHT;
}

function getMoisture(x, y){
    return 1.0;
}

// gets the color at the position
function getColor(x, y) {
    const value = NOISE_HEIGHT.GetNoise(x, y) * 0.5 + 0.5;
    return {
        r: value,
        g: value,
        b: value
    };
}

// holds functions for generating the terrain
const GENERATOR = {
    getHeight: getHeight,
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
        if(!polygon)
        {
            console.error("Polygon is null.");
            return;
        }

        // skip if not enough points for a triangle
        if(polygon.length < 3)
        {
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
            heights.set(point, GENERATOR.getHeight(point.x, point.y));

            // add to center
            center.x += x;
            center.y += y;
        });
        center.x /= polygon.length;
        center.y /= polygon.length;

        // set height for center and each point, if needed
        // center should not exist so just set it
        heights.set(center, GENERATOR.getHeight(center.x, center.y));

        nodes.push({
            points: points,
            center: center,
            color: GENERATOR.getColor(center.x, center.y)
        });
    });

    return {
        nodes: nodes,
        heights: heights
    };
}

function generateMesh(map)
{
    // take the polygon data and average out the color per each polygon per each point
    const colors = new Map(); //  { value, count } pairs

    function addColor(position, color){
        const key = `x${position.x}y${position.y}z${position.z}`
        if(colors.has(key)){
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
        } else{
            // add new
            colors.set(key, {
                color: color,
                count: 1
            });
        }
    }

    map.nodes.forEach((node) => {
        // add center
        addColor(node.center, node.color);

        // add points
        node.points.forEach((point) => {
            addColor(point, node.color);
        });
    });
    
    // average the colors based on the counts
    colors.forEach((data) => {
        data.color.r = data.color.r / data.count;
        data.color.g = data.color.g / data.count;
        data.color.b = data.color.b / data.count;
    });

    function getColor(position){
        return colors.get(`x${position.x}y${position.y}z${position.z}`).color;
    }

    function getHeight(position){
        const height = map.heights.get(position)
        return Math.max(WORLD_WATER_LEVEL, height);
    }

    let index = 0;
    const vertices = [];
    const indices = [];

    // create the mesh from the polygons
    map.nodes.forEach((node) => {
        // add center
        vertices.push(node.center.x * WORLD_WIDTH, getHeight(node.center), node.center.y * WORLD_WIDTH);
        let color= getColor(node.center);
        vertices.push(color.r, color.g, color.b);

        // create mesh by triangulating the vertices
        for(let i = 0; i < node.points.length; i++){
            // add side
            vertices.push(node.points[i].x * WORLD_WIDTH, getHeight(node.points[i]), node.points[i].y * WORLD_WIDTH);
            if(BLEND_COLORS){
                color = getColor(node.points[i]);
            } else{
                color = node.color
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