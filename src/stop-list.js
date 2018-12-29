import hyperscript from 'hyperscript';
import hyperx from 'hyperx';
import { renderSpoilers } from '~/stop-spoilers';

const hx = hyperx(hyperscript);

// The maximum number of stops shown that we can load spoilers for.
const maxStopsForSpoilers = 10;

export default function StopList(stops, getSpoilers) {
    const root = hx`
        <ul class="stop-list">
            ${stops.map(stop => hx`
                <li class="stop-list__item" data-stop-id="${stop.id}">
                    <a class="stop-list__link" href="/departures/from-stop/${stop.id}">${stop.name}</a>
                </li>
            `)}
        </ul>
    `;

    loadSpoilers(root, stops, getSpoilers);
    return root;
}

function loadSpoilers(root, stops, getSpoilers) {
    if (stops.length > maxStopsForSpoilers) {
        return;
    }

    stops.forEach(function (stop) {
        const stopNode = root.querySelector(`[data-stop-id="${stop.id}"]`);
        getSpoilers(stop.id)
            .then(spoilers => {
                const spoilerNode = renderSpoilers(spoilers);
                stopNode.classList.add('stop-list__item--spoilers');
                stopNode.querySelector('.stop-list__link').appendChild(spoilerNode);
            });
    });
}
