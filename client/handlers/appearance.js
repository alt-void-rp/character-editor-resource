import * as alt from 'alt-client';
import * as native from 'natives';

// --- Создание previewPed ---
export function ensureFreemodeModel() {
    const player = alt.Player.local;
    if (!player) return;

    const currentModel = native.getEntityModel(player.scriptID);
    const MALE = native.getHashKey('mp_m_freemode_01');
    const FEMALE = native.getHashKey('mp_f_freemode_01');

    if (currentModel === MALE || currentModel === FEMALE) return;

    // Устанавливаем модель через setTimeout, чтобы гарантировать загрузку педа
    alt.setTimeout(() => {
        try {
            native.setPlayerModel(player.scriptID, MALE);
            native.setPedDefaultComponentVariation(player.scriptID);
            alt.log('✅ Player model set to freemode for editor');
        } catch (err) {
            alt.logError('Failed to set freemode model: ' + err);
        }
    }, 500);
}

// --- Функции изменения внешности на previewPed ---
function getPed() {
    return alt.Player.local;
}

export function setHeadBlend(data) {
    const ped = getPed();
    native.setPedHeadBlendData(
        ped,
        data.shapeFirstID,
        data.shapeSecondID,
        data.shapeThirdID,
        data.skinFirstID,
        data.skinSecondID,
        data.skinThirdID,
        data.shapeMix,
        data.skinMix,
        data.thirdMix,
        data.isParent
    );
}

export function setMicroMorph(data) {
    native.setPedMicroMorph(getPed(), data.index, data.scale);
}

export function setHeadOverlay(data) {
    const ped = getPed();
    native.setPedHeadOverlay(ped, data.overlayID, data.index, data.opacity);
    native.setPedHeadOverlayTint(ped, data.overlayID, data.colorType, data.colorID, data.secondColorID);
}

export function setEyeColor(index) {
    native.setHeadBlendEyeColor(getPed(), index);
}

export function setHair(data) {
    native.setPedHairTint(getPed(), data.colorID, data.highlightColorID);
}

export function addTattoo(hash) {
    native.addPedDecorationFromHashes(getPed(), hash.collection, hash.overlay);
}
