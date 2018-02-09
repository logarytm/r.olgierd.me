import StopListByStreet from '~/stop-list-by-street.js';

export default function showAllStops({ stopRepository }) {
  return stopRepository
    .findAllByStreets()
    .then(streets => {
      return {
        title: 'Przystanki',
        html: StopListByStreet(streets),
      };
    });
}
