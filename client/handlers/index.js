import * as alt from 'alt-client';
//import { spawnPreviewPed } from '../editor/preview.js'
import { InitCamera } from '../camera/index.js';
import { CLIENT_EVENTS } from '../../shared/events.js';

export async function setModel(model){
    const gender = JSON.parse(model).gender;
    alt.emitServer(CLIENT_EVENTS.CHARACTER_SET_MODEL, gender);
    await InitCamera();
}