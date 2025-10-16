import * as alt from 'alt-client';
import { InitCamera } from './camera/index.js';
import { FRONTEND_URL } from '../shared/events.js';
import { registerServerEvents, registerWebViewEvents } from './events/index.js';

const webview = new alt.WebView(`${FRONTEND_URL}/character/editor`, true);

if (webview) { 
    webview.unfocus();
    webview.isVisible = false; 
}

export const Editor = (() => {

    const InitEditor = async () => {

        registerWebViewEvents(webview);
        registerServerEvents();

        if (webview) {
            webview.focus();
            webview.isVisible = true; 
            alt.showCursor(true);
            alt.toggleGameControls(false);
        }

    };

    return { InitEditor };
})();

alt.log('✅ Resource [character-editor] client started');
