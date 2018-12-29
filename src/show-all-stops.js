import StopListByStreet from '~/stop-list-by-street.js';
import { setSearchIconTarget } from '~/global-state';

import hyperscript from 'hyperscript';
import hyperx from 'hyperx';
import mountNode from '~/mount-node';

const hx = hyperx(hyperscript);

export default function showAllStops({ stopRepository }) {
    setSearchIconTarget('/stops');

    var root = hx`
        <div>
            <div class="notice">
                Ładowanie…
            </div>
        </div>
    `;

    function replaceStops(streets) {
        var view = StopListByStreet(streets, stopRepository.loadSpoilersForStreet.bind(stopRepository));
        mountNode(view, root);
    }

    stopRepository
        .findAllByStreets()
        .then(replaceStops)
        .catch(() => {
            root.querySelector('.notice').innerHTML = 'Sprawdź połączenie z&nbsp;internetem.';
        });

    return {
        title: 'Przystanki',
        html: root,
    };
}
