import flatten from 'ramda/src/flatten';

export function getStopsWithDuplicateNames(stops) {
    const seen = {};
    const duplicateStopsForBasicName = {};

    // eg. "Architektów" if the stop name is "Architektów 01"
    function extractNumberlessName(name) {
        const match = /^(.*?)\s+([a-zA-Z0-9]+?)$/.exec(name);

        return match ? match[1] : name;
    }

    stops.forEach(stop => {
        const numberlessName = extractNumberlessName(stop.name);

        if (!seen[numberlessName]) {
            seen[numberlessName] = { name: numberlessName, id: stop.id };
        } else {
            // this numberless name was already seen, which means we have a duplicate!
            if (!duplicateStopsForBasicName[numberlessName]) {
                // this is the first duplicate, but we have to add the stop previously seen
                duplicateStopsForBasicName[numberlessName] = [seen[numberlessName]];
            }

            duplicateStopsForBasicName[numberlessName].push({ name: numberlessName, id: stop.id });
        }
    });

    return Object.values(duplicateStopsForBasicName).reduce((a, b) => [...a, ...b], []);
}
