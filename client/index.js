import * as alt from 'alt-client';
import { registerServerEvents, registerWebViewEvents } from './events/index.js';
import { InitCamera, DestroyCamera } from './camera/index.js';
import { spawnPreviewPed, destroyPreviewPed } from './handlers/preview.js';

const webview = new alt.WebView('http://resource/client/ui/editor.html', true);

if (webview) {
    webview.focus();
    alt.showCursor(true);
    alt.toggleGameControls(false);
}

registerWebViewEvents(webview);
registerServerEvents();

export const Editor = (() => {
    const InitEditor = async () => {
        await spawnPreviewPed();
        await InitCamera();

        alt.on('keydown', async (key) => {
            if (key === alt.KeyCode.J) await setCameraPreset('full-body');
            if (key === alt.KeyCode.K) await setCameraPreset('face');
            if (key === alt.KeyCode.L) await setCameraPreset('side');
        });

        alt.log('📝 Character Editor initialized');
    };

    const DestroyEditor = () => {
        DestroyCamera();
        destroyPreviewPed();

        if (webview) {
            webview.unfocus();
            alt.showCursor(false);
        }

        alt.log('🧹 Character Editor destroyed');
    };

    return { InitEditor, DestroyEditor };
})();

alt.log('✅ Resource [character-editor] client started');
