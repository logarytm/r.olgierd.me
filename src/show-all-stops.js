import StopListByStreet from './stop-list-by-street';
import { setSearchIconTarget } from './ui/global-state';

import mountNode from './mount-node';
import { notice } from './ui/notice';
import Dom from './misc/dom';

export default function showAllStops({ stopRepository }) {
    setSearchIconTarget('/stops');

    var root = Dom.el('div');

    function replaceStops(streets) {
        var view = StopListByStreet(streets, stopRepository.loadSpoilersForStreet.bind(stopRepository));
        mountNode(view, root);
    }

    stopRepository
        .findAllByStreets()
        .then(replaceStops)
        .catch(reason => {
            notice('Sprawdź połączenie z&nbsp;internetem.');
        });

    return {
        title: 'Przystanki',
        html: root,
    };
}
