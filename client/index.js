import * as alt from 'alt-client';
import * as native from 'natives';
import { FRONTEND_URL } from '../shared/events.js';
import { registerServerEvents, registerWebViewEvents } from './events/index.js';
import { spawnPreviewPed } from './editor/preview.js';
import { InitCamera } from './camera/index.js';

let webview = null;

export const Editor = (() => {

    const InitEditor = async () => {
        await alt.Utils.wait(2000);
        if (!webview) {
            webview = new alt.WebView(`${FRONTEND_URL}/character/editor`, false);
            registerWebViewEvents(webview);
            registerServerEvents();
        }
        native.displayRadar(false);

        const ped = await spawnPreviewPed('mp_m_freemode_01');
        await InitCamera(ped);

        
        webview.focus();
        webview.isVisible = true; 
        alt.showCursor(true);
        alt.toggleGameControls(false);

    };

    const CloseEditor = () => {
        if (!webview) return;

        webview.isVisible = false;
        webview.unfocus();
        alt.showCursor(false);
        alt.toggleGameControls(true);

        native.displayRadar(true);
    };

    return { InitEditor, CloseEditor };
})();

alt.log('✅ Resource [character-editor] client started');
