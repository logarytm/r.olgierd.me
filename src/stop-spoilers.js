import Dom from './misc/dom';

const DIRECTION_LENGTH_LIMIT = 30;

function renderSingleSpoiler(line, direction, isFirst) {
    const separator = isFirst ? '' : ', ';
    if (direction.length > DIRECTION_LENGTH_LIMIT) {
        direction = direction.replace(/\s.*$/, '') + '…';
    }

    return Dom.el('span.stop-spoilers__item', [
        separator,
        line,
        Dom.el('span.stop-spoilers__arrow', ['→']),
        direction,
    ]);
}

export function renderSpoilers(spoiler) {
    return Dom.el(
        'div.stop-spoilers',
        spoiler.map(({ line, direction }, index) => renderSingleSpoiler(line, direction, index === 0)),
    );
}
