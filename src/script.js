const POINT_COUNT_AXIS = 10;
const POINT_COUNT = POINT_COUNT_AXIS * POINT_COUNT_AXIS;
const WORLD_WIDTH = 10.0;
const WORLD_POINT_SCALE = WORLD_WIDTH / POINT_COUNT_AXIS;
const WORLD_HEIGHT = 2.0;
const FREQUENCY = 2.0 / POINT_COUNT_AXIS; // divide by count to keep consistent regardless of count value

// gets the height at the position
function getHeight(noise, x, y) {
    return noise.GetNoise(x, y) * 0.5 + 0.5;
}

// gets the color at the position
function getColor(noise, x, y) {
    // const value = noise.GetNoise(x, y) * 0.5 + 0.5;
    const value = 1.0;
    return {
        r: value,
        g: value,
        b: value
    };
}

// generates a position and color data for each point on the map
function generateMap(seed = 1337) {
    function generateRandomPoints(numPoints) {
        let points = [];
        for (let i = 0; i < numPoints; i++) {
            points.push({
                x: Math.random(),
                y: Math.random()
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
    const finalCentroids = lloydsAlgorithm(points, 1.0 / POINT_COUNT_AXIS, 2);

    console.log(points.length);
    console.log(finalCentroids.length);

    let list = [];

    finalCentroids.forEach(function(item, index, array){
        list.push({
            position: {
                x: item.x * WORLD_WIDTH,
                y: item.y * WORLD_WIDTH,
                z: 0
            },
            color: getColor(null, item.x * WORLD_WIDTH, item.y * WORLD_WIDTH)
        });
    });

    // turn it into a mesh
    const vertices = [];
    const indices = [];
    
    const TRIANGLE_SIZE = WORLD_POINT_SCALE * 0.5;
    const TRIANGLE_SIZE_HALF = TRIANGLE_SIZE * 0.5;

    list.forEach(function(item, index){
        vertices.push(item.position.x, item.position.y, item.position.z);
        vertices.push(item.color.r, item.color.g, item.color.b);
        vertices.push(item.position.x - TRIANGLE_SIZE_HALF, item.position.y - TRIANGLE_SIZE, item.position.z);
        vertices.push(item.color.r, item.color.g, item.color.b);
        vertices.push(item.position.x + TRIANGLE_SIZE_HALF, item.position.y - TRIANGLE_SIZE, item.position.z);
        vertices.push(item.color.r, item.color.g, item.color.b);

        indices.push(index * 3 + 0);
        indices.push(index * 3 + 1);
        indices.push(index * 3 + 2);
    });

    // // add all the vertices
    // list.forEach(function(item, index, array){
    //     vertices.push(item.position.x, item.position.y, item.position.z);
    //     vertices.push(item.color.r, item.color.g, item.color.b);
    // });
    
    // // add the indices, each set of 2 triangles should be [(x, y), (x, y + 1), (x + 1, y)], [(x + 1, y), (x, y + 1), (x + 1, y + 1)]
    // for (let y = 0; y < POINT_COUNT_AXIS - 1; y++) {
    //     for (let x = 0; x < POINT_COUNT_AXIS - 1; x++) {
    //         // calculate indices
    //         const i = y * POINT_COUNT_AXIS + x;
    //         const ix = i + 1;
    //         const iy = i + POINT_COUNT_AXIS;
    //         const ixy = iy + 1;

    //         // add indices to array
    //         indices.push(i, iy, ix, ix, iy, ixy);
    //     }
    // }

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