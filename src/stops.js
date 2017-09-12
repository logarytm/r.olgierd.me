const base = 'https://cors-anywhere.herokuapp.com/http://einfo.erzeszow.pl/Home';

export function allStops() {
  return fetch(base + '/GetBusStopList?q=&ttId=0')
    .then((response) => response.json())
    .then((json) => {
      return json
        .map(function mapStreet(street) {
          return {
            name: street[1],
            stops: street[2].map(function mapStop(stop) {
              return {
                id: stop[0],
                name: stop[1],
              };
            }),
          };
        });
      });
}
