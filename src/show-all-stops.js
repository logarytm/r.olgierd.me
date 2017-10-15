import StopListByStreet from '~/stop-list-by-street.js';

export default function showAllStops({ stopRepository }) {
  return stopRepository
    .allByStreets()
    .then(streets => StopListByStreet(streets));
}
