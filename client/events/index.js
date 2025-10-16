import * as alt from 'alt-client';
import { EVENTS, CLIENT_EVENTS } from '../../shared/events.js';
import { setModel } from '../handlers/index.js'


export function registerServerEvents() {
    alt.onServer(EVENTS.SERVER.CHARACTER_UPDATE, (data) => {
        alt.log('Server character update received:', data);
    });
}

export function registerWebViewEvents(webview) {
    if (!webview) return;

    webview.on(CLIENT_EVENTS.CHARACTER_SET_MODEL, async (data) => await setModel(data));

    alt.log('🌐 WebView events registered');
}
