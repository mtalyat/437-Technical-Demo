// rendering
const spinCheckbox = document.getElementById('spinCheckbox');
const rotationSlider = document.getElementById('rotationSlider');
const rotationSlider2 = document.getElementById('rotationSlider2');
const useLightingCheckbox = document.getElementById('useLightingCheckbox');
const widthNumber = document.getElementById('widthNumber');
const heightNumber = document.getElementById('heightNumber');
const scaleNumber = document.getElementById('scaleNumber');
// generation
const seedNumber = document.getElementById('seedNumber');
const detailSlider = document.getElementById('detailSlider');
const polygonModeDropdown = document.getElementById('polygonModeDropdown');
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
    spin: Boolean(spinCheckbox.checked),
    rotation: Number(rotationSlider.value),
    rotation2: Number(rotationSlider2.value),
    useLighting: Boolean(useLightingCheckbox.checked),
    tileMode: String(heightFunctionDropdown.value).startsWith('getHeightWrap'),

    width: Number(widthNumber.value),
    height: Number(heightNumber.value),
    scale: Number(scaleNumber.value),

    // generation data
    seed: Number(seedNumber.value),
    detail: Number(detailSlider.value),
    polygonIterations: Number(polygonModeDropdown.value),
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

spinCheckbox.addEventListener('change', function () {
    sessionData.spin = Boolean(this.checked);
    rotationSlider.disabled = sessionData.spin;
});

rotationSlider.addEventListener('input', function () {
    sessionData.rotation = Number(this.value);
    renderUpdate();
});

rotationSlider2.addEventListener('input', function () {
    sessionData.rotation2 = Number(this.value);
    renderUpdate();
});

useLightingCheckbox.addEventListener('change', function () {
    sessionData.useLighting = Boolean(this.checked);
    renderUpdate();
});

widthNumber.addEventListener('change', function () {
    sessionData.width = Number(this.value);
    terrainUpdate();
});

heightNumber.addEventListener('change', function () {
    sessionData.height = Number(this.value);
    terrainUpdate();
});

scaleNumber.addEventListener('change', function () {
    sessionData.scale = Number(this.value);
    renderUpdate();
});

seedNumber.addEventListener('change', function () {
    sessionData.seed = Number(this.value);
    terrainUpdate();
});

detailSlider.addEventListener('change', function () {
    sessionData.detail = Number(this.value);
    terrainUpdate();
});

polygonModeDropdown.addEventListener('change', function () {
    sessionData.polygonIterations = Number(this.value);
    terrainUpdate();
});

colorFunctionDropdown.addEventListener('change', function () {
    sessionData.getColorFunction = window[this.value];
    terrainUpdate();
});

noiseTypeDropdown.addEventListener('change', function () {
    sessionData.noiseType = this.value;
    terrainUpdate();
});

heightFunctionDropdown.addEventListener('change', function () {
    sessionData.getHeightFunction = window[this.value];
    sessionData.tileMode = String(this.value).startsWith('getHeightWrap');
    terrainUpdate();
});

heightFrequencyNumber.addEventListener('change', function () {
    sessionData.heightFrequency = Number(this.value);
    terrainUpdate();
});

fractalTypeDropdown.addEventListener('change', function () {
    sessionData.fractalType = this.value;
    const disabled = sessionData.fractalType === 'None';
    octavesNumber.disabled = disabled;
    lacunarityNumber.disabled = disabled;
    gainNumber.disabled = disabled;
    terrainUpdate();
});

octavesNumber.addEventListener('change', function () {
    sessionData.octaves = Number(this.value);
    terrainUpdate();
});

lacunarityNumber.addEventListener('change', function () {
    sessionData.lacunarity = Number(this.value);
    terrainUpdate();
});

gainNumber.addEventListener('change', function () {
    sessionData.gain = Number(this.value);
    terrainUpdate();
});

moistureFrequencyNumber.addEventListener('change', function () {
    sessionData.moistureFrequency = Number(this.value);
    terrainUpdate();
});

seaLevelSlider.addEventListener('change', function () {
    sessionData.seaLevel = Number(this.value);
    terrainUpdate();
});

function terrainUpdate() {
    // generate the map data
    const map = generateMap();

    // turn it into a mesh
    const mesh = generateMesh(map);

    // render the mesh
    setRenderObjectMesh(mesh);
}

function main() {
    // resize canvas so the image is clear
    updateCanvas();

    // update values
    terrainUpdate();
    renderUpdate();

    let lastTime;

    function loop(time) {
        // if time invalid, skip frame
        if (time === undefined) {
            window.requestAnimationFrame(loop);
            return;
        }

        // get delta time for animations
        if (!lastTime) lastTime = time;
        const deltaTime = (time / lastTime) / 1000; // seconds
        lastTime = time;

        // if animating, update
        let update = false;

        if (sessionData.spin) {
            // add to rotate and update
            sessionData.rotation += 45 * deltaTime;

            // update slider
            rotationSlider.value = sessionData.rotation % 360;

            update = true;
        }

        if (update) {
            renderUpdate();
        }

        render();

        // if wraping, render more copies
        if (sessionData.tileMode) {
            for (let y = -1; y <= 1; y++) {
                for (let x = -1; x <= 1; x++) {
                    // skip center, it has already been rendered
                    if (y === 0 && x === 0) continue;

                    renderCopy({
                        x: x * sessionData.width,
                        y: 0.0,
                        z: y * sessionData.width
                    });
                }
            }
        }

        // keep drawing every frame
        window.requestAnimationFrame(loop);
    }

    loop();
}

main();
