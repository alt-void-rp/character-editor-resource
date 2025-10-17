import { spawnPreviewPed } from '../editor/preview.js'
import { InitCamera } from '../camera/index.js';


/**
 * Устанавливает модель предпросмотра (previewPed)
 */
export async function setModel(modelName) {
    if (!modelName) return;
    await spawnPreviewPed(modelName);
    await InitCamera();

}