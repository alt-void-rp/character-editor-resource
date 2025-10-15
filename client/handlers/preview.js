import * as alt from 'alt-client';
import * as native from 'natives';

let previewPed = null;

export function getPreviewPed() {
    return previewPed;
}

async function loadModel(hash) {
    native.requestModel(hash);
    let attempts = 0;

    while (!native.hasModelLoaded(hash) && attempts < 50) {
        await alt.Utils.wait(100);
        attempts++;
    }

    return native.hasModelLoaded(hash);
}

export async function spawnPreviewPed() {
    const player = alt.Player.local;
    const maleHash = native.getHashKey('mp_m_freemode_01');
    const modelLoaded = await loadModel(maleHash);

    if (!modelLoaded) {
        alt.logError('❌ Модель freemode не загрузилась!');
        return;
    }

    try {
        // ✅ Исправлено: передаём 2 аргумента
        native.setPlayerModel(player, maleHash);

        native.setPedDefaultComponentVariation(player.scriptID);
        alt.log('✅ Модель freemode установлена');
    } catch (err) {
        alt.logError('❌ Не удалось установить модель freemode:', err);
        return;
    }

    if (previewPed) destroyPreviewPed();

    const pos = player.pos;
    previewPed = native.clonePed(player.scriptID, false, false, true);
    native.setEntityCoords(previewPed, pos.x, pos.y, pos.z, false, false, false, true);
    native.setEntityHeading(previewPed, player.rot.z);
    native.setEntityVisible(player.scriptID, false, false);

    alt.log('👤 Preview ped создан');
}

export function destroyPreviewPed() {
    const player = alt.Player.local;

    if (previewPed) {
        native.deletePed(previewPed);
        previewPed = null;
        alt.log('🗑️ Preview ped удалён');
    }

    native.setEntityVisible(player.scriptID, true, false);
}
