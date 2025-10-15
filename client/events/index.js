import * as alt from 'alt-client';
import { EVENTS, CLIENT_EVENTS } from '../constants.js';
import * as appearance from '../handlers/appearance.js';
import { focusOnLimb, setCameraPreset } from '../camera/index.js';

export function registerServerEvents() {
    alt.onServer(EVENTS.SERVER.CHARACTER_UPDATE, (data) => {
        alt.log('Server character update received', data);
    });
}

// WebView события
export function registerWebViewEvents(webview) {
    if (!webview) return;

    // Внешность
    webview.on(CLIENT_EVENTS.CHARACTER_SET_HEAD_BLEND, (data) => appearance.setHeadBlend(data));
    webview.on(CLIENT_EVENTS.CHARACTER_SET_MICRO_MORPH, (data) => appearance.setMicroMorph(data));
    webview.on(CLIENT_EVENTS.CHARACTER_SET_HEAD_OVERLAY, (data) => appearance.setHeadOverlay(data));
    webview.on(CLIENT_EVENTS.CHARACTER_SET_EYE_COLOR, (index) => appearance.setEyeColor(index));
    webview.on(CLIENT_EVENTS.CHARACTER_SET_HAIR, (data) => appearance.setHair(data));
    webview.on(CLIENT_EVENTS.CHARACTER_ADD_TATTOO, (hash) => appearance.addTattoo(hash));

    // Камера через WebView
    webview.on(CLIENT_EVENTS.CHARACTER_FOCUS_LIMB, (pos) => focusOnLimb(pos));
    webview.on(CLIENT_EVENTS.CHARACTER_SET_CAMERA_PRESET, (preset) => setCameraPreset(preset));
}
