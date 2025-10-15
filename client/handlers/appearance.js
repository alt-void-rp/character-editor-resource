import * as native from 'natives';
import * as alt from 'alt-client';
import { getPreviewPed } from './preview.js';

function ped() {
    const player = alt.Player.local;
    if (!player || !player.scriptID) return null;
    return getPreviewPed() || player.scriptID;
}

export function setHeadBlend(data) {
    native.setPedHeadBlendData(
        ped(),
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
    native.setPedMicroMorph(ped(), data.index, data.scale);
}

export function setHeadOverlay(data) {
    native.setPedHeadOverlay(ped(), data.overlayID, data.index, data.opacity);
    native.setPedHeadOverlayTint(ped(), data.overlayID, data.colorType, data.colorID, data.secondColorID);
}

export function setEyeColor(index) {
    native.setHeadBlendEyeColor(ped(), index);
}

export function setHair(data) {
    native.setPedHairTint(ped(), data.colorID, data.highlightColorID);
}

export function addTattoo(hash) {
    native.addPedDecorationFromHashes(ped(), hash.collection, hash.overlay);
}
