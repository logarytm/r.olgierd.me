const localForage = require('localforage');
const R = require('ramda');

export default function CachedRepository(repositoryName, implementation) {
  function cacheTag(methodName, args) {
    return `${repositoryName}:${methodName}:${JSON.stringify(args)}`;
  }

  function shouldRedownload(result) {
    return result === null ||
      Math.abs(Date.now() - result.timestamp) > 1000 * implementation.cacheTTL;
  }

  function wrapInCache(f) {
    const methodName = f.name;
    if (!methodName) {
      throw new TypeError('Repository methods must have names.');
    }

    return function cacheWrapped(...args) {
      return localForage.getItem(cacheTag(methodName, args))
        .then(function validate(result) {
          if (shouldRedownload(result)) {
            return f.call(implementation, ...args)
              .then(function store(data) {
                return localForage.setItem(cacheTag(methodName, args), {
                  data,
                  timestamp: Date.now(),
                }).then(() => data);
              });
          }

          return result.data;
        });
    };
  }

  return R.mapObjIndexed(function wrapFunctionsInCache(value, key) {
    return typeof value === 'function' && key !== 'allMatching' ? wrapInCache(value) : value;
  })(implementation);
}
