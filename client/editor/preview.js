import * as alt from 'alt-client';
import * as native from 'natives';

let previewPed = null;

const mp_m_freemode_01 = 0x705E61F2;
const mp_f_freemode_01 = 0x9C9EFFD8;

async function loadModel(model) {
    const modelHash = typeof model === 'string' ? native.getHashKey(model) : model;

    native.requestModel(modelHash);
    let attempts = 0;

    while (!native.hasModelLoaded(modelHash)) {
        await alt.Utils.wait(100);
        attempts++;
        if (attempts > 100) {
            alt.logError(`❌ Модель ${model} не загрузилась`);
            return false;
        }
    }

    return true;
}

export async function spawnPreviewPed(model = 'mp_m_freemode_01') {
    const player = alt.Player.local;
    if (!player?.valid) {
        alt.logError('❌ Игрок не готов');
        return;
    }

    const modelHash =
        model === 'mp_f_freemode_01'
            ? mp_f_freemode_01
            : model === 'mp_m_freemode_01'
            ? mp_m_freemode_01
            : native.getHashKey(model);

    const loaded = await loadModel(modelHash);
    if (!loaded) return;

    // Удаляем старого педа, если есть
    if (previewPed && native.doesEntityExist(previewPed)) {
        native.deletePed(previewPed);
        previewPed = null;
    }

    // Скрываем игрока
    native.setEntityVisible(player.scriptID, false, false);

    // Создаём педа немного перед игроком
    const pos = { x: player.pos.x, y: player.pos.y, z: player.pos.z};
    previewPed = native.createPed(2, modelHash, pos.x, pos.y, pos.z, 180.0, false, true);

    if (!native.doesEntityExist(previewPed)) {
        alt.logError('❌ PreviewPed не появился');
        return null;
    }

    native.setPedDefaultComponentVariation(previewPed);
    native.setEntityInvincible(previewPed, true);
    native.freezeEntityPosition(previewPed, true);
    native.taskStandStill(previewPed, -1);

    native.setModelAsNoLongerNeeded(modelHash);

    alt.log(`✅ PreviewPed успешно создан (${model})`);
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
        alt.log('🗑️ Preview ped удалён');
    }

    native.setEntityVisible(player.scriptID, true, false);
}
