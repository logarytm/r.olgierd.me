import race from './misc/promise-race';
import { enterOfflineState } from './ui/global-state';

const knownProviders = [
    'https://cors-anywhere.herokuapp.com/{}',
    'https://ancient-anchorage-62560.herokuapp.com/{}',
];
const usedProviders = [...knownProviders];

function rememberFastestProvider(url, originalUrl) {
    const bestProvider = knownProviders
        .find(providerUrl => url === makeUrlForProvider(providerUrl, originalUrl));

    if (!bestProvider) {
        return;
    }

    usedProviders.length = 1;
    usedProviders[0] = bestProvider;
}

export default function fetchWithCors(url, options) {
    function tryProvider(providerUrl) {
        return fetch(makeUrlForProvider(providerUrl, url), options)
            .then(response => {
                if (response.status >= 400) {
                    throw response;
                }

                return response;
            });
    }

    return race(usedProviders.map(tryProvider))
        .then(result => {
            rememberFastestProvider(result.url, url);

            return result;
        })
        .catch(enterOfflineState);
}

function makeUrlForProvider(providerUrl, requestUrl) {
    return providerUrl.replace('{}', requestUrl);
}
