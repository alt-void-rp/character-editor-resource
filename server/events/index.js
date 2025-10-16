import * as alt from 'alt-server';
import { CLIENT_EVENTS } from '../../shared/events.js';
import { setModel } from '../handlers/character.js'


export function registerEvents() {
    alt.onClient(CLIENT_EVENTS.CHARACTER_SET_MODEL, setModel);

    alt.log('🌐 Server events registered');
}