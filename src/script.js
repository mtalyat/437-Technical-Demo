const rotationSlider = document.getElementById('rotationSlider');
const seedNumber = document.getElementById('seedNumber');
const detailSlider = document.getElementById('detailSlider');
const noiseTypeDropdown = document.getElementById('noiseTypeDropdown');
const seaLevelSlider = document.getElementById('seaLevelSlider');

const sessionData = {
    // rendering data
    rotation: Number(rotationSlider.value),

    // generation data
    seed: Number(seedNumber.value),
    detail: Number(detailSlider.value),
    noiseType: noiseTypeDropdown.value,
    seaLevel: Number(seaLevelSlider.value),
};

rotationSlider.addEventListener('input', function(){
    sessionData.rotation = Number(this.value);
    renderUpdate();
});

seedNumber.addEventListener('change', function(){
    sessionData.seed = Number(this.value);
    terrainUpdate();
});

detailSlider.addEventListener('change', function(){
    sessionData.detail = Number(this.value);
    terrainUpdate();
});

noiseTypeDropdown.addEventListener('change', function(){
    sessionData.noiseType = this.value;
    terrainUpdate();
});

seaLevelSlider.addEventListener('input', function(){
    sessionData.seaLevel = Number(this.value);
    terrainUpdate();
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

function terrainUpdate(){
        // generate the map data
        const map = generateMap();

        // turn it into a mesh
        const mesh = generateMesh(map);
    
        // render the mesh
        setRenderObjectMesh(mesh);
}

function main() {
    terrainUpdate();
    renderUpdate();

    startRendering();
}

main();
