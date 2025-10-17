import { spawnPreviewPed } from '../editor/preview.js';
import { InitCamera } from '../camera/index.js';

export async function setModel(modelName) {
    if (!modelName) return;
    const ped = await spawnPreviewPed(modelName);
    InitCamera(ped);
}
