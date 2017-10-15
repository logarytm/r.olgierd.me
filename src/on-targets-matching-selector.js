export default function forTargetsMatchingSelector(selector, listener) {
  return function checkEventTarget(e) {
    if (e.target.matches(selector)) {
      return listener(e);
    }

    return true;
  };
}
