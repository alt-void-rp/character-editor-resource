import * as native from 'natives';
import * as alt from 'alt-client';

/**
 * Установить родителей и смешивание лица
 */
export async function setPedParents(ped, dad, mom, shapeMix, skinMix) {
    native.setPedHeadBlendData(
        ped,
        dad,        // shapeFirst (отец)
        mom,        // shapeSecond (мать)
        0,          // третья форма (можно 0)
        dad,        // skinFirst
        mom,        // skinSecond
        0,          // skinThird
        shapeMix,   // смешивание формы
        skinMix,    // смешивание кожи
        0,          // третье смешивание
        false       // isParent?
    );
}