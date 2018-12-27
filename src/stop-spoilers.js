import hyperscript from 'hyperscript';
import hyperx from 'hyperx';

const hx = hyperx(hyperscript);

const directionLengthLimit = 30;

function renderSingleSpoiler(line, direction, isFirst) {
    const separator = isFirst ? '' : ', ';
    if (direction.length > directionLengthLimit) {
        direction = direction.replace(/\s.*$/, '') + '…';
    }

    return hx`<span class="stop-spoilers__item">${separator}${line}<span class="stop-spoilers__arrow">→</span>${direction}</span>`;
}

export function renderSpoilers(spoiler) {
    return hx`
        <div class="stop-spoilers">
            ${spoiler.map(({ line, direction }, index) => renderSingleSpoiler(line, direction, index === 0))}
        </div>
    `;
}
