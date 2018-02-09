const localForage = require('localforage');
const R = require('ramda');

export default function CachedRepository(implementation, { repositoryName, methods }) {
  function cacheKeyFor(methodName, args) {
    return `${repositoryName}:${methodName}:${JSON.stringify(args)}`;
  }

  function shouldRedownload(result, { cacheTTL }) {
    return result === null ||
      Math.abs(Date.now() - result.timestamp) > 1000 * cacheTTL;
  }

  function wrapInCache(f, methodOptions) {
    const methodName = f.name;
    if (!methodName) {
      throw new TypeError('Repository methods must have names.');
    }

    function getCached(...args) {
      return localForage.getItem(cacheKeyFor(methodName, args));
    }

    return function cacheWrapped(...args) {
      return localForage.getItem(cacheKeyFor(methodName, args))
        .then(function validate(result) {
          if (shouldRedownload(result, methodOptions)) {
            return f.apply(implementation, args)
              .then(function store(data) {
                return localForage.setItem(cacheKeyFor(methodName, args), {
                  data,
                  timestamp: Date.now(),
                }).then(() => data);
              });
          }

          return result.data;
        });
    };
  }

  return R.mapObjIndexed(function transform(value, key) {
    if (methods.hasOwnProperty(key)) {
      return wrapInCache(value, methods[key]);
    }

    return value;
  }, implementation);
}
