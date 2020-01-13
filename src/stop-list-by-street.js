import onTargetsMatchingSelector from './on-targets-matching-selector';
import { renderSpoilers } from './stop-spoilers';
import Dom from './misc/dom';

export default function StopListByStreet(streets, loadSpoilersForStreet) {
    const root = Dom.el('div.stop-list-by-street', [
        Dom.el('ul.stops', streets.map((street, index) => {
            return Dom.el('li.stops__street-item', [
                Dom.el('button.stops__street-name', { type: 'button' }, [street.name]),
                Dom.el(
                    'ul.u-hidden.stops__per-street-list',
                    {
                        'data-street-name': street.name,
                        'data-street-index': index,
                    },
                    street.stops.map(stop => {
                        return Dom.el('li.stops__stop-item', { 'data-stop-id': stop.id }, [
                            Dom.el('a.stops__stop-name', { href: `/departures/from-stop/${stop.id}` }, [stop.name]),
                        ]);
                    }),
                ),
            ]);
        })),
    ]);

    root.addEventListener('click', onTargetsMatchingSelector('.stops__street-name', toggleStreet));

    const spoilersLoaded = {};

    function toggleStreet(e) {
        const street = e.target.parentNode.querySelector('.stops__per-street-list');

        e.target.classList.toggle('stops__street-name--expanded');
        street.classList.toggle('u-hidden');

        let streetName = street.getAttribute('data-street-name');
        if (spoilersLoaded[streetName]) {
            return;
        }

        loadSpoilersForStreet(streetName, spoiler => {
            const stopNode = street.querySelector(`[data-stop-id="${spoiler.id}"]`);
            if (!stopNode) {
                return;
            }

            stopNode.classList.add('stops__stop-item--spoilers');
            stopNode.querySelector('.stops__stop-name').appendChild(renderSpoilers(spoiler.spoilers));
        });

        spoilersLoaded[streetName] = true;
    }

    return root;
};
