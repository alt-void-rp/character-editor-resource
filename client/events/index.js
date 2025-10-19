import * as alt from 'alt-client';
import { EVENTS, CLIENT_EVENTS } from '../../shared/events.js';
import { setModel, setParents } from '../handlers/index.js'
import { setCameraPreset } from '../camera/index.js';


export function registerServerEvents() {
    alt.onServer(EVENTS.SERVER.CHARACTER_SET_MODEL, async (data) => {
        setModel(data);
    });
}

export function registerWebViewEvents(webview) {
    if (!webview) return;

    webview.on(CLIENT_EVENTS.CHARACTER_SET_MODEL, (data) => {
        const gender = JSON.parse(data).gender;
        alt.emitServer(CLIENT_EVENTS.CHARACTER_SET_MODEL, gender);
    });

    webview.on(CLIENT_EVENTS.CHARACTER_CAMERA_POSE, async (data) => {
        const preset = JSON.parse(data).gender;
        await setCameraPreset(preset);
    });

    webview.on(CLIENT_EVENTS.CHARACTER_SET_PARENTS, async (data) => {
        const d = JSON.parse(data);
        setParents(d);
    });


    


    

    alt.log('🌐 WebView events registered');
}
