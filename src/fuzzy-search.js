export default function createFuzzySearch(possibleResults) {
  function calculateScore(string, pattern) {
    const SCORE_INSIDE = 1;
    const SCORE_BEGINNING = 3;

    const words = string.split(/[^A-Za-z0-9]/g);

    return words.reduce(function matchWord({ score, patternChar }, word) {
      if (word[0] === pattern[patternChar]) {
        return {
          score: score + SCORE_BEGINNING,
          patternChar: patternChar + (patternChar === pattern.length - 1 ? 0 : 1),
        };
      } else if (word.includes(pattern[patternChar])) {
        return {
          score: score + SCORE_INSIDE,
          patternChar: patternChar + (patternChar === pattern.length - 1 ? 0 : 1),
        };
      }

      return { score, patternChar };
    }, { score: 0, patternChar: 0 }).score;
  }

  function scoresFor(pattern) {
    return possibleResults.map(function elementWithScore(element) {
      return { element, score: calculateScore(element, pattern) };
    });
  }

  function search(pattern, { inclusionThreshold }) {
    const scores = scoresFor(pattern);
    const total = scores
      .reduce((memo, { score }) => memo + score, 0);

    return scores
      .filter(({ score }) => score / total >= inclusionThreshold)
      .sort((first, second) => second.score - first.score)
      .map(({ element }) => element);
  }

  return search;
}
