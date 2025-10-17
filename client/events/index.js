import * as alt from 'alt-client';
import { EVENTS, CLIENT_EVENTS } from '../../shared/events.js';
import { setModel } from '../handlers/index.js'


export function registerServerEvents() {
    alt.onServer(EVENTS.SERVER.CHARACTER_SET_MODEL, async (data) => {
        setModel(data);
    });
}

export function registerWebViewEvents(webview) {
    if (!webview) return;

    webview.on(CLIENT_EVENTS.CHARACTER_SET_MODEL, (data) => {
        const gender = JSON.parse(data).gender;
        console.log(gender);
        alt.emitServer(CLIENT_EVENTS.CHARACTER_SET_MODEL, gender);
    });

    alt.log('🌐 WebView events registered');
}
