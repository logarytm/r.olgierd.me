import { renderSpoilers } from './stop-spoilers';
import Dom from './misc/dom';

// The maximum number of stops shown that we can load spoilers for.
const maxStopsForSpoilers = 10;

export default function StopList(stops, getSpoilers) {
    const root = Dom.el('ul.stop-list', stops.map(stop => {
        return Dom.el('li.stop-list__item', { 'data-stop-id': stop.id }, [
            Dom.el('a.stop-list__link', { href: `/departures/from-stop/${stop.id}` }, [stop.name]),
        ]);
    }));

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
