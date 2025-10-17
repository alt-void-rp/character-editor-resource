import * as alt from 'alt-client';
import * as native from 'natives';
import { getPreviewPed } from '../editor/preview.js';

let camera = null;
let currentPreset = 'full-body';
let targetPos = null;
let tickHandler = null;
let distance = 1.5;
let lerpSpeed = 0.1;

// --- Получение педа с ожиданием ---
async function waitForPed(timeout = 5000) {
    const start = Date.now();
    while (!getPreviewPed()) {
        if (Date.now() - start > timeout) {
            alt.logError('❌ PreviewPed не появился за 5 секунд');
            return null;
        }
        await alt.Utils.wait(50);
    }
    return getPreviewPed();
}

// --- Инициализация камеры редактора ---
export async function InitCamera() {
    const ped = await waitForPed();
    if (!ped) return;

    alt.toggleGameControls(false);
    alt.showCursor(true);

    // Сбрасываем поворот педа
    native.setEntityHeading(ped, 180);
    native.setEntityRotation(ped, 0, 0, 180, 2, true);
    native.freezeEntityPosition(ped, true);

    // Создаём камеру
    camera = native.createCam("DEFAULT_SCRIPTED_CAMERA", true);
    native.setCamActive(camera, true);
    native.renderScriptCams(true, false, 0, true, false, 0);

    targetPos = native.getEntityCoords(ped, true);

    setCameraPreset(currentPreset);

    tickHandler = alt.everyTick(() => updateCamera(ped));

    alt.log('🎥 Camera initialized for previewPed');
}

// --- Установка пресета камеры ---
export async function setCameraPreset(preset) {
    currentPreset = preset;
    const ped = await waitForPed();
    if (!ped) return;

    const pos = native.getEntityCoords(ped, true);
    switch (preset) {
        case 'side':
            distance = 1.5;
            targetPos = { x: pos.x, y: pos.y, z: pos.z + 0.2 };
            break;
        case 'face':
            distance = 0.6;
            targetPos = { x: pos.x, y: pos.y, z: pos.z + 0.6 };
            break;
        case 'full-body':
            distance = 1.2;
            targetPos = { x: pos.x, y: pos.y, z: pos.z + 0.3 };
            break;
    }
}

// --- Фокусировка на конечности ---
export function focusOnLimb(pos) {
    targetPos = pos;
}

// --- Zoom камеры ---
export function zoomCamera(delta) {
    distance = Math.max(0.3, Math.min(3, distance - delta));
}

// --- Получение смещения камеры относительно педа ---
function getCameraOffset(ped) {
    const pos = native.getEntityCoords(ped, true);

    switch (currentPreset) {
        case 'side':
            return { x: pos.x - distance, y: pos.y, z: pos.z + 0.5 };
        case 'face':
            return { x: pos.x, y: pos.y - distance, z: pos.z + 0.65 };
        case 'full-body':
            return { x: pos.x, y: pos.y - distance, z: pos.z + 0.5 };
        default:
            return { x: pos.x - distance, y: pos.y, z: pos.z + 1 };
    }
}

// --- Обновление камеры ---
function updateCamera(ped) {
    if (!camera || !ped) return;

    const focus = targetPos || (() => {
        const pos = native.getEntityCoords(ped, true);
        return { x: pos.x, y: pos.y, z: pos.z + 0.9 };
    })();

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
