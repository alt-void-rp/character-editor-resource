import * as alt from 'alt-client';
import * as native from 'natives';

let previewPed = null;

/**
 * Загружает модель по имени с безопасной проверкой
 */
export async function loadModel(modelName) {
    const hash = native.getHashKey(modelName); // ✅ правильный метод

    if (!native.isModelInCdimage(hash) || !native.isModelValid(hash)) {
        alt.logError(`❌ Модель ${modelName} (${hash}) не существует или недоступна`);
        return null;
    }

    native.requestModel(hash);

    let attempts = 0;
    while (!native.hasModelLoaded(hash)) {
        await new Promise(res => alt.setTimeout(res, 50));
        attempts++;
        if (attempts > 100) {
            alt.logError(`⏱ Не удалось загрузить модель ${modelName} (${hash})`);
            return null;
        }
    }

    alt.log(`✅ Модель ${modelName} загружена`);
    return hash;
}

/**
 * Создаёт previewPed для предпросмотра персонажа
 */
export async function spawnPreviewPed(modelName) {
    const player = alt.Player.local;
    if (!player?.valid || !player.scriptID) {
        alt.logError('❌ Игрок не готов');
        return null;
    }

    // Предзагрузка freemode моделей (важно!)
    await loadModel('mp_m_freemode_01');
    await loadModel('mp_f_freemode_01');

    const modelHash = await loadModel(modelName);
    if (!modelHash) return null;

    // Удаляем предыдущего педа
    if (previewPed && native.doesEntityExist(previewPed)) {
        native.deletePed(previewPed);
        previewPed = null;
    }

    // Скрываем игрока
    native.setEntityVisible(player.scriptID, false, false);

    const pos = player.pos;
    previewPed = native.createPed(2, modelHash, pos.x, pos.y, pos.z, 180.0, false, true);

    if (!native.doesEntityExist(previewPed)) {
        alt.logError(`❌ PreviewPed не появился (${modelName})`);
        return null;
    }

    //native.setPedDefaultComponentVariation(previewPed); // можно вызвать до или после очистки, но лучше после
    native.setEntityInvincible(previewPed, true);
    native.freezeEntityPosition(previewPed, true);
    native.taskStandStill(previewPed, -1);

    native.setModelAsNoLongerNeeded(modelHash);

    alt.log(`✅ PreviewPed успешно создан (${modelName}) с одними штанами`);
}

/**
 * Возвращает текущего previewPed
 */
export function getPreviewPed() {
    return previewPed;
}

/**
 * Удаляет previewPed и возвращает видимость игрока
 */
export function destroyPreviewPed() {
    const player = alt.Player.local;

    if (previewPed && native.doesEntityExist(previewPed)) {
        native.deletePed(previewPed);
        previewPed = null;
        alt.log('🗑️ PreviewPed удалён');
    }

    native.setEntityVisible(player.scriptID, true, false);
}