export default function fetchWithCors(url, options) {
  const providers = [
    'https://cors-anywhere.herokuapp.com/{}',
    `https://cryptic-headland-94862.herokuapp.com/{}`,
  ];

  function tryFetch(i) {
    if (i === providers.length) {
      return Promise.reject(
        new Error('No CORS providers are available at this moment.'));
    }

    return fetch(providers[i].replace('{}', url), options)
      .then(response => {
        if (response.status > 500) {
          return tryFetch(i + 1);
        }

        return response;
      })
      .catch(() => {
        return tryFetch(i + 1);
      });
  }

  return tryFetch(0);
}
