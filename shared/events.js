import * as SHARED_VARIABLES from 'alt:backend-controls'

export const EVENTS = {
    SERVER: {
        CHARACTER_UPDATE: 'server:characterUpdate',
        CHARACTER_SET_MODEL: 'server:setModel',
    },
};

export const CLIENT_EVENTS = {
    CHARACTER_SET_HEAD_BLEND: 'character:setHeadBlend',
    CHARACTER_SET_MICRO_MORPH: 'character:setMicroMorph',
    CHARACTER_SET_HEAD_OVERLAY: 'character:setHeadOverlay',
    CHARACTER_SET_EYE_COLOR: 'character:setEyeColor',
    CHARACTER_SET_HAIR: 'character:setHair',
    CHARACTER_ADD_TATTOO: 'character:addTattoo',
    CHARACTER_FOCUS_LIMB: 'character-editor:focusLimb',
    CHARACTER_SET_CAMERA_PRESET: 'character-editor:setPreset',
    CHARACTER_SET_MODEL: 'character-editor:setModel',
    CHARACTER_CAMERA_POSE: 'character-editor:setPoseCamera',
    CHARACTER_SET_PARENTS: 'character-editor:setPedParents'
};

export const FRONTEND_URL = `${SHARED_VARIABLES.FRONTEND_URL}`;