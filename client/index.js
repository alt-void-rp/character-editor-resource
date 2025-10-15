import * as alt from 'alt-client';
import { registerServerEvents, registerWebViewEvents } from './events/index.js';
import { 
    InitCamera, 
    DestroyCamera, 
} from './camera/index.js';
import * as appearance from './handlers/appearance.js';

function editor(webview) {
    
    registerServerEvents();
    registerWebViewEvents(webview);

    const InitEditor = () => {
        appearance.ensureFreemodeModel();

        // Камера
        InitCamera();
        if (webview) {
            webview.focus();          
            alt.showCursor(true);      
            alt.toggleGameControls(false); 
        }
        alt.log('📝 Editor initialized');

        // Горячие клавиши
        alt.on('keydown', (key) => {
            if (key === alt.KeyCode.J) setCameraPreset('full-body');
            if (key === alt.KeyCode.K) setCameraPreset('face');
            if (key === alt.KeyCode.L) setCameraPreset('side');
        });

    };

    const DestroyEditor = () => {
        DestroyCamera();
        if (webview) {
            webview.unfocus();
            webview.showCursor(false);
        }
        alt.log('📝 Editor destroyed');
    };

    return { InitEditor, DestroyEditor };
}

// --- WebView ---
const webview = new alt.WebView('http://resource/client/ui/editor.html', true);
export const Editor = editor(webview);

// --- Автозапуск ---
alt.log('✅ Resource [character-editor] client started');
