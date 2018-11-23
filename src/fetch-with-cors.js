import { enterOfflineState } from '~/global-state.js';

export default function fetchWithCors(url, options) {
    const providers = [
        'https://cors-anywhere.herokuapp.com/{}',
    ];

    function tryProvider(provider) {
        return fetch(provider.replace('{}', url), options)
            .then(response => {
                if (response.status >= 500) {
                    throw response;
                }

                return response;
            });
    }

    return Promise.race(providers.map(tryProvider))
        .catch(enterOfflineState);
}
