import * as alt from 'alt-client';
import * as native from 'natives';
import { getPreviewPed } from '../editor/preview.js';

let camera = null;
let currentPreset = 'full-body';
let targetPos = null;       // Куда смотрит камера
let tickHandler = null;
let distance = 1.5;
let lerpSpeed = 0.12;

// --- Ждём педа с готовой позицией ---
async function waitForPed(timeout = 5000) {
    const start = Date.now();
    let ped;
    while (true) {
        ped = getPreviewPed();
        if (ped && native.doesEntityExist(ped)) return ped;
        if (Date.now() - start > timeout) return null;
        await alt.Utils.wait(50);
    }
}

// --- Преобразуем градусы в радианы ---
function degToRad(deg) {
    return deg * (Math.PI / 180);
}

// --- Forward/Right вектора педа ---
function getPedBasis(ped) {
    const heading = native.getEntityHeading(ped);
    const h = degToRad(heading);
    return {
        forward: { x: Math.sin(h), y: -Math.cos(h) },
        right:   { x: Math.cos(h), y: Math.sin(h) }
    };
}

// --- Смещение камеры относительно педа ---
export function getCameraOffset(ped) {
    if (!ped) return { x: 0, y: 0, z: 0 };
    const pos = native.getEntityCoords(ped, true);
    const { forward, right } = getPedBasis(ped);

    switch (currentPreset) {
        case 'side':
            return {
                x: pos.x + right.x * distance - forward.x * 0.3,
                y: pos.y + right.y * distance - forward.y * 0.3,
                z: pos.z + 0.5
            };
        case 'face':
            return {
                x: pos.x - forward.x * distance,
                y: pos.y - forward.y * distance,
                z: pos.z + 0.65
            };
        case 'full-body':
            return {
                x: pos.x - forward.x * distance,
                y: pos.y - forward.y * distance,
                z: pos.z + 0.5
            };
        default:
            return {
                x: pos.x - forward.x * distance,
                y: pos.y - forward.y * distance,
                z: pos.z + 1
            };
    }
}

// --- Инициализация камеры ---
export async function InitCamera() {
    const ped = await waitForPed();
    if (!ped) return alt.logError('No PreviewPed found for camera');

    alt.toggleGameControls(false);
    alt.showCursor(true);

    native.freezeEntityPosition(ped, true);

    // Получаем стартовое смещение камеры сразу
    const offset = getCameraOffset(ped);

    camera = native.createCam("DEFAULT_SCRIPTED_CAMERA", true);
    native.setCamCoord(camera, offset.x, offset.y, offset.z); // Камера сразу в нужной позиции
    native.setCamActive(camera, true);
    native.renderScriptCams(true, false, 0, true, false, 0);

    // Изначально камера смотрит на педа
    targetPos = native.getEntityCoords(ped, true);

    // Ставим текущий пресет, чтобы targetPos был корректным
    await setCameraPreset(currentPreset);

    if (tickHandler) alt.clearEveryTick(tickHandler);
    tickHandler = alt.everyTick(() => updateCamera(ped));

    alt.log('🎥 Camera initialized for PreviewPed');
}

// --- Смена пресета камеры ---
export async function setCameraPreset(preset) {
    currentPreset = preset;
    const ped = await waitForPed();
    if (!ped || !camera) return;

    const pos = native.getEntityCoords(ped, true);

    switch (preset) {
        case 'side':
            distance = 1.5;
            targetPos = { x: pos.x, y: pos.y, z: pos.z + 0.2 };
            break;
        case 'face':
            distance = 0.6;
            targetPos = { x: pos.x, y: pos.y, z: pos.z + 0.65 };
            break;
        case 'full-body':
            distance = 1.2;
            targetPos = { x: pos.x, y: pos.y, z: pos.z + 0.5 };
            break;
        default:
            distance = 1.5;
            targetPos = { x: pos.x, y: pos.y, z: pos.z + 0.5 };
            break;
    }
}

// --- Zoom камеры ---
export function zoomCamera(delta) {
    distance = Math.max(0.3, Math.min(3, distance - delta));
}

// --- Фокус на конечности ---
export function focusOnLimb(pos) {
    if (!pos) return;
    targetPos = pos;
}

// --- Обновление камеры каждый тик ---
function updateCamera(ped) {
    if (!camera || !ped) return;
    if (!native.doesEntityExist(ped)) return;

    const focus = targetPos || native.getEntityCoords(ped, true);
    const camCoord = native.getCamCoord(camera);
    const offset = getCameraOffset(ped);

    const newX = camCoord.x + (offset.x - camCoord.x) * lerpSpeed;
    const newY = camCoord.y + (offset.y - camCoord.y) * lerpSpeed;
    const newZ = camCoord.z + (offset.z - camCoord.z) * lerpSpeed;

    native.setCamCoord(camera, newX, newY, newZ);
    native.pointCamAtCoord(camera, focus.x, focus.y, focus.z);
}

// --- Уничтожение камеры ---
export async function DestroyCamera() {
    const ped = await waitForPed();
    if (!camera) return;

    native.renderScriptCams(false, false, 0, true, false, 0);
    native.destroyCam(camera, false);
    camera = null;

    if (tickHandler) {
        alt.clearEveryTick(tickHandler);
        tickHandler = null;
    }

    if (ped) native.freezeEntityPosition(ped, false);

    alt.toggleGameControls(true);
    alt.showCursor(false);
}
