import StopListByStreet from './stop-list-by-street';
import { setSearchIconTarget } from './ui/global-state';

import hyperscript from 'hyperscript';
import hyperx from 'hyperx';
import mountNode from '~/mount-node';
import { notice } from './ui/notice';

const hx = hyperx(hyperscript);

export default function showAllStops({ stopRepository }) {
    setSearchIconTarget('/stops');

    var root = hx`
        <div></div>
    `;

    function replaceStops(streets) {
        var view = StopListByStreet(streets, stopRepository.loadSpoilersForStreet.bind(stopRepository));
        mountNode(view, root);
    }

    stopRepository
        .findAllByStreets()
        .then(replaceStops)
        .catch(reason => {
            console.log(reason);
            notice('Sprawdź połączenie z&nbsp;internetem.');
        });

    return {
        title: 'Przystanki',
        html: root,
    };
}
