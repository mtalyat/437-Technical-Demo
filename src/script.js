// rendering
const rotationSlider = document.getElementById('rotationSlider');
const useLightingCheckbox = document.getElementById('useLightingCheckbox');
// generation
const seedNumber = document.getElementById('seedNumber');
const detailSlider = document.getElementById('detailSlider');
const colorFunctionDropdown = document.getElementById('colorFunctionDropdown');
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
    useLighting: Boolean(useLightingCheckbox.value),

    // generation data
    seed: Number(seedNumber.value),
    detail: Number(detailSlider.value),
    getColorFunction: window[colorFunctionDropdown.value],
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
};

rotationSlider.addEventListener('input', function(){
    sessionData.rotation = Number(this.value);
    renderUpdate();
});

useLightingCheckbox.addEventListener('input', function(){
    sessionData.useLighting = Boolean(this.checked);
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

colorFunctionDropdown.addEventListener('change', function(){
    sessionData.getColorFunction = window[this.value];
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
