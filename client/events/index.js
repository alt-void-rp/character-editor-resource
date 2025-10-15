import * as alt from 'alt-client';
import { EVENTS, CLIENT_EVENTS } from '../constants.js';
import * as appearance from '../handlers/appearance.js';
import { focusOnLimb, setCameraPreset } from '../camera/index.js';

export function registerServerEvents() {
    alt.onServer(EVENTS.SERVER.CHARACTER_UPDATE, (data) => {
        alt.log('Server character update received:', data);
    });
}

export function registerWebViewEvents(webview) {
    if (!webview) return;

    webview.on(CLIENT_EVENTS.CHARACTER_SET_HEAD_BLEND, appearance.setHeadBlend);
    webview.on(CLIENT_EVENTS.CHARACTER_SET_MICRO_MORPH, appearance.setMicroMorph);
    webview.on(CLIENT_EVENTS.CHARACTER_SET_HEAD_OVERLAY, appearance.setHeadOverlay);
    webview.on(CLIENT_EVENTS.CHARACTER_SET_EYE_COLOR, appearance.setEyeColor);
    webview.on(CLIENT_EVENTS.CHARACTER_SET_HAIR, appearance.setHair);
    webview.on(CLIENT_EVENTS.CHARACTER_ADD_TATTOO, appearance.addTattoo);

    webview.on(CLIENT_EVENTS.CHARACTER_FOCUS_LIMB, focusOnLimb);
    webview.on(CLIENT_EVENTS.CHARACTER_SET_CAMERA_PRESET, setCameraPreset);

    alt.log('🌐 WebView events registered');
}
