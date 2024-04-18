// rendering
const rotationSlider = document.getElementById('rotationSlider');
// generation
const seedNumber = document.getElementById('seedNumber');
const detailSlider = document.getElementById('detailSlider');
const noiseTypeDropdown = document.getElementById('noiseTypeDropdown');
//      height
const heightFunctionDropdown = document.getElementById('heightFunctionDropdown');
const heightFrequencyNumber = document.getElementById('heightFrequencyNumber');
const fractalTypeDropdown = document.getElementById('fractalTypeDropdown');
const octavesNumber = document.getElementById('octavesNumber');
const lacunarityNumber = document.getElementById('lacunarityNumber');
const gainNumber = document.getElementById('gainNumber');
//      moisture
const moistureFrequencyNumber = document.getElementById('moistureFrequencyNumber');
const seaLevelSlider = document.getElementById('seaLevelSlider');

const sessionData = {
    // rendering data
    rotation: Number(rotationSlider.value),

    // generation data
    seed: Number(seedNumber.value),
    detail: Number(detailSlider.value),
    noiseType: noiseTypeDropdown.value,
    //      height
    getHeightFunction: window[heightFunctionDropdown.value],
    heightFrequency: Number(heightFrequencyNumber.value),
    fractalType: fractalTypeDropdown.value,
    octaves: Number(octavesNumber.value),
    lacunarity: Number(lacunarityNumber.value),
    gain: Number(gainNumber.value),
    //      moisture
    getMoistureFunction: window['getMoisture'],
    moistureFrequency: Number(moistureFrequencyNumber.value),
    seaLevel: Number(seaLevelSlider.value),
    
    // misc.
    getColorFunction: window['getColor']
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

heightFunctionDropdown.addEventListener('change', function(){
    sessionData.getHeightFunction = window[this.value];
    terrainUpdate();
});

heightFrequencyNumber.addEventListener('change', function(){
    sessionData.heightFrequency = Number(this.value);
    terrainUpdate();
});

fractalTypeDropdown.addEventListener('change', function(){
    sessionData.fractalType = this.value;
    const disabled = sessionData.fractalType === 'None';
    octavesNumber.disabled = disabled;
    lacunarityNumber.disabled = disabled;
    gainNumber.disabled = disabled;
    terrainUpdate();
});

octavesNumber.addEventListener('change', function(){
    sessionData.octaves = Number(this.value);
    terrainUpdate();
});

lacunarityNumber.addEventListener('change', function(){
    sessionData.lacunarity = Number(this.value);
    terrainUpdate();
});

gainNumber.addEventListener('change', function(){
    sessionData.gain = Number(this.value);
    terrainUpdate();
});

moistureFrequencyNumber.addEventListener('change', function(){
    sessionData.moistureFrequency = Number(this.value);
    terrainUpdate();
});

seaLevelSlider.addEventListener('change', function(){
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
