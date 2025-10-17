import * as alt from 'alt-server';
import { EVENTS } from '../../shared/events.js'

const MODEL_HASHES = {
    mp_m_freemode_01: 1885233650, // male
    mp_f_freemode_01: 2627665880, // female
};

export function setModel(player, modelName) {
    if (!player || !modelName) return;
    const modelHash = MODEL_HASHES[modelName];
    if (!modelHash) {
        alt.logError(`❌ Неизвестная модель: ${modelName}`);
        return;
    }

    player.model = modelHash;
    alt.emitClient(player, EVENTS.SERVER.CHARACTER_SET_MODEL, modelName);
}
