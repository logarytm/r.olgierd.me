import StopListByStreet from '~/stop-list-by-street.js';
import { setSearchIconTarget } from './global-state';

export default function showAllStops({ stopRepository }) {
    setSearchIconTarget('/stops');

    return stopRepository
        .findAllByStreets()
        .then(streets => {
            return {
                title: 'Przystanki',
                html: StopListByStreet(streets),
            };
        });
}
