const POINT_COUNT_AXIS = 10;
const POINT_COUNT = POINT_COUNT_AXIS * POINT_COUNT_AXIS;
const WORLD_WIDTH = 10.0;
const WORLD_POINT_SCALE = WORLD_WIDTH / POINT_COUNT_AXIS;
const WORLD_HEIGHT = 2.0;
const FREQUENCY = 2.0 / POINT_COUNT_AXIS; // divide by count to keep consistent regardless of count value

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

// could do a random seed with Math.random()
const SEED = 1337;
const rng = new RandomNumberGenerator(SEED);

// gets the height at the position
function getHeight(noise, x, y) {
    return noise.GetNoise(x, y) * 0.5 + 0.5;
}

// gets the color at the position
function getColor(noise, x, y) {
    // const value = noise.GetNoise(x, y) * 0.5 + 0.5;
    return {
        r: rng.random() * 0.9 + 0.1,
        g: rng.random() * 0.9 + 0.1,
        b: rng.random() * 0.9 + 0.1
    };
}

// generates a position and color data for each point on the map
function generateMap(seed = 1337) {
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
    
    const points = generateRandomPoints(POINT_COUNT);
    const centroids = lloydsAlgorithm(points, 1.0 / POINT_COUNT_AXIS, 2);
    const polygonCenters = [];
    centroids.forEach((item, index) => {
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

    // create the mesh from the polygons
    polygons.forEach((polygon, polygonIndex) => {
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
        let centerX = 0, centerY = 0;
        polygon.forEach(([x, y]) => {
            centerX += x;
            centerY += y;
        });
        centerX /= polygon.length;
        centerY /= polygon.length;

        // get color
        const color = getColor(null, centerX, centerY);

        nodes.push({
            points: polygon,
            center: {
                x: centerX,
                y: centerY
            },
            color: color
        });
    });

    return {
        nodes: nodes
    };
}

function generateMesh(map)
{
    // turn it into a mesh
    let index = 0;
    const vertices = [];
    const indices = [];

    // create the mesh from the polygons
    map.nodes.forEach((node) => {
        // add center
        vertices.push(node.center.x * WORLD_WIDTH, node.center.y * WORLD_WIDTH, 0.0);
        vertices.push(node.color.r, node.color.g, node.color.b);

        // create mesh by triangulating the vertices
        for(let i = 0; i < node.points.length; i++){
            // add side
            vertices.push(node.points[i][0] * WORLD_WIDTH, node.points[i][1] * WORLD_WIDTH, 0.0);
            vertices.push(node.color.r, node.color.g, node.color.b);

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

const map = generateMap(Math.floor(Math.random() * 10001));
const mesh = generateMesh(map);
setObjectMesh(mesh);

render();