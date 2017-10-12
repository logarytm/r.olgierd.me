# Rzeszowski Autobus

## Building

The code uses ECMAScript 2015 modules bundled by `webpack`. ECMAScript 2015 is
compiled to plain-old ES5 via `babel`. Unit tests use `tape`. Code style issues
are checked for by `eslint`. Stylesheets are preprocessed by `sass` and
Autoprefixer.

To start a development server, use:

```
npm run start
```

To build a distributable version:

```
npm run build
```

To start tests:

```
npm run test
```

To check for coding style issues:

```
npm run lint
```
