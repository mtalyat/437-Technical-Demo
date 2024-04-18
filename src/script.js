function main() {
    // generate the map data
    const map = generateMap();

    // turn it into a mesh
    const mesh = generateMesh(map);

    // set the mesh to render
    setObjectMesh(mesh);

    // render it
    render();
}

main();
