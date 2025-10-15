import * as alt from 'alt-client';
import * as native from 'natives';

let camera = null;
let currentPreset = 'full-body';
let targetPos = null;       // Точка, на которую смотрит камера
let tickHandler = null;
let distance = 1.5;         // базовое расстояние от цели
let lerpSpeed = 0.1;        // скорость плавного движения

// --- Инициализация камеры редактора ---
export function InitCamera() {
    const player = alt.Player.local;

    alt.toggleGameControls(false);
    alt.showCursor(true);

    // --- Сбрасываем поворот игрока ---
    native.setEntityHeading(player.scriptID, 180); // 180° - игрок лицом к камере
    native.setEntityRotation(player.scriptID, 0, 0, 180, 2, true);
    native.freezeEntityPosition(player.scriptID, true);


    camera = native.createCam("DEFAULT_SCRIPTED_CAMERA", true);
    native.setCamActive(camera, true);
    native.renderScriptCams(true, false, 0, true, false, 0);

    targetPos = player.pos;

    setCameraPreset(currentPreset);

    tickHandler = alt.everyTick(updateCamera);

    alt.log('🎥 Camera initialized');
}

// --- Устанавливаем пресет камеры ---
export function setCameraPreset(preset) {
    currentPreset = preset;
    const player = alt.Player.local;
    const pos = player.pos;

    switch (preset) {
        case 'side':
            distance = 1.5;
            targetPos = { x: pos.x, y: pos.y, z: pos.z + 0.2 };
            break;
        case 'face':
            distance = 0.6;
            targetPos = { x: pos.x, y: pos.y, z: pos.z  + 0.6 };
            break;
        case 'full-body':
            distance = 1.2;
            targetPos = { x: pos.x, y: pos.y, z: pos.z + 0.3 };
            break;
    }
}

// --- Фокусировка на конечности ---
export function focusOnLimb(pos) {
    // pos = координаты конечности, куда должна смотреть камера
    targetPos = pos;
}

// --- Zoom камеры ---
export function zoomCamera(delta) {
    distance = Math.max(0.3, Math.min(3, distance - delta));
}

// --- Получение смещения камеры относительно персонажа ---
function getCameraOffset() {
    const player = alt.Player.local;
    const pos = player.pos;

    switch (currentPreset) {
        case 'side':
            // Камера сзади игрока и чуть выше, смотрит на центр тела
            return {
                x: pos.x - distance,  
                y: pos.y,             
                z: pos.z + 0.5        
            };
        case 'face':
            // Камера спереди на уровне лица
            return {
                x: pos.x,  
                y: pos.y - distance,
                z: pos.z + 0.65
            };
        case 'full-body':
            // Камера сбоку
            return {
                x: pos.x,
                y: pos.y - distance, // сбоку
                z: pos.z + 0.5
            };
        default:
            return {
                x: pos.x - distance,
                y: pos.y,
                z: pos.z + 1
            };
    }
}

// --- Обновление камеры каждый тик ---
function updateCamera() {
    if (!camera) return;
    const player = alt.Player.local;

    // Камера всегда должна смотреть на targetPos
    const focus = targetPos || {
        x: player.pos.x,
        y: player.pos.y,
        z: player.pos.z + 0.9
    };

    const camCoord = native.getCamCoord(camera);
    const offset = getCameraOffset();

    const newX = camCoord.x + (offset.x - camCoord.x) * lerpSpeed;
    const newY = camCoord.y + (offset.y - camCoord.y) * lerpSpeed;
    const newZ = camCoord.z + (offset.z - camCoord.z) * lerpSpeed;

    native.setCamCoord(camera, newX, newY, newZ);

    native.pointCamAtCoord(camera, focus.x, focus.y, focus.z);
}

// --- Уничтожение камеры ---
export function DestroyCamera() {
    if (!camera) return;

    native.renderScriptCams(false, false, 0, true, false, 0);
    native.destroyCam(camera, false);
    camera = null;

    if (tickHandler) {
        alt.clearEveryTick(tickHandler);
        tickHandler = null;
    }

    // --- Разморозка игрока ---
    native.freezeEntityPosition(alt.Player.local.scriptID, false);

    alt.toggleGameControls(true);
    alt.showCursor(false);
}
