import race from './misc/promise-race';
import { enterOfflineState } from '~/ui/global-state';

export default function fetchWithCors(url, options) {
    const providers = [
        'https://cors-anywhere.herokuapp.com/{}',
        'https://ancient-anchorage-62560.herokuapp.com/{}',
    ];

    function tryProvider(provider) {
        return fetch(provider.replace('{}', url), options)
            .then(response => {
                if (response.status >= 400) {
                    throw response;
                }

                return response;
            });
    }

    return race(providers.map(tryProvider))
        .catch(enterOfflineState);
}
