import * as alt from 'alt-client';
import * as native from 'natives';

let previewPed = null;

// Хэши freemode моделей
const MODEL_HASHES = {
    mp_m_freemode_01: 1885233650,
    mp_f_freemode_01: 2627665880,
};

// Загружаем модель
async function loadModel(modelName) {
    const hash = MODEL_HASHES[modelName];
    if (!hash) {
        alt.logError(`❌ Неизвестная модель: ${modelName}`);
        return null;
    }

    native.requestModel(hash);
    let attempts = 0;
    while (!native.hasModelLoaded(hash)) {
        await alt.Utils.wait(50);
        attempts++;
        if (attempts > 100) {
            alt.logError(`❌ Модель ${modelName} не загрузилась`);
            return null;
        }
    }
    return hash;
}

// Сбрасываем всё кроме штанов
function clearClothesExceptPants(ped) {
    if (!ped || !native.doesEntityExist(ped)) return;

    for (let slot = 0; slot <= 11; slot++) {
        if (slot === 2) continue; // оставляем штаны
        native.setPedComponentVariation(ped, slot, 0, 0, 0);
    }
}

// Создаём PreviewPed
export async function spawnPreviewPed(modelName) {
    const player = alt.Player.local;
    if (!player?.valid || !player.scriptID) {
        alt.logError('❌ Игрок не готов');
        return null;
    }

    const modelHash = await loadModel(modelName);
    if (!modelHash) return null;

    // Удаляем старого педа
    if (previewPed && native.doesEntityExist(previewPed)) {
        native.deletePed(previewPed);
        previewPed = null;
    }

    // Скрываем игрока
    native.setEntityVisible(player.scriptID, false, false);

    const pos = player.pos;
    previewPed = native.createPed(2, modelHash, pos.x, pos.y - 6, pos.z -1, 0, false, true);

    if (!native.doesEntityExist(previewPed)) {
        alt.logError(`❌ PreviewPed не появился (${modelName})`);
        return null;
    }

    native.setPedDefaultComponentVariation(previewPed);
    clearClothesExceptPants(previewPed);
    native.setEntityInvincible(previewPed, true);
    native.freezeEntityPosition(previewPed, true);
    native.taskStandStill(previewPed, -1);

    native.setModelAsNoLongerNeeded(modelHash);

    alt.log(`✅ PreviewPed успешно создан (${modelName})`);
    return previewPed;
}

export function getPreviewPed() {
    return previewPed;
}

export function destroyPreviewPed() {
    const player = alt.Player.local;
    if (previewPed && native.doesEntityExist(previewPed)) {
        native.deletePed(previewPed);
        previewPed = null;
    }
    native.setEntityVisible(player.scriptID, true, false);
}
