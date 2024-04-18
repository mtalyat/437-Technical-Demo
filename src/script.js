document.getElementById('rotationSlider').addEventListener('input', function(){
    sessionData.rotation = (this.value / 360) * Math.PI * 2;
    renderUpdate();
});

document.addEventListener('keydown', function(event) {
    switch (event.key) {
        case 'ArrowUp':
            console.log('Arrow up was pressed');
            break;
        case 'ArrowDown':
            console.log('Arrow down was pressed');
            break;
        case 'ArrowLeft':
            console.log('Arrow left was pressed');
            break;
        case 'ArrowRight':
            console.log('Arrow right was pressed');
            break;
        default:
            // Handle other keys or ignore
            console.log('Other key pressed');
            break;
    }
});

function main() {
    // generate the map data
    const map = generateMap();

    // turn it into a mesh
    const mesh = generateMesh(map);

    // render the mesh
    setRenderObjectMesh(mesh);
    render();
}

main();
