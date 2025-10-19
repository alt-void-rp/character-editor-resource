import { spawnPreviewPed, getPreviewPed } from '../editor/preview.js';
import { setPedParents } from '../editor/appearance.js';
import { InitCamera } from '../camera/index.js';

export async function setModel(modelName) {
    if (!modelName) return;
    const ped = await spawnPreviewPed(modelName);
    InitCamera(ped);
}

export async function setParents(data) {
    if (!data) return;
    const ped = await getPreviewPed();
    await setPedParents(ped, data.dad, data.mom, data.shapeMix, data.skinMix);
}
