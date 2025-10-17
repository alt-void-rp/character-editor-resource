import * as alt from 'alt-client';
import { FRONTEND_URL } from '../shared/events.js';
import { registerServerEvents, registerWebViewEvents } from './events/index.js';

let webview = null;

export const Editor = (() => {

    const InitEditor = async () => {
        if (!webview) {
            webview = new alt.WebView(`${FRONTEND_URL}/character/editor`, true);
            registerWebViewEvents(webview);
            registerServerEvents();
        }

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
    };

    return { InitEditor, CloseEditor };
})();

alt.log('✅ Resource [character-editor] client started');
