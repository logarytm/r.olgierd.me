export default function createFuzzySearch(possibleResults) {
  function calculateScore(string, pattern) {
    const factor = 0.1;
    let lastMatch = -1;
    let score = 0.0;

    for (let i = 0, j = 0; i < string.length && j < pattern.length; i += 1, j += 1) {
      if (string[i] === pattern[j]) {
        score += factor / Math.abs(i - lastMatch);
        lastMatch = i;
      }
    }

    return score;
  }

  function scoresFor(pattern) {
    return possibleResults.map(function elementWithScore(element) {
      return { element, score: calculateScore(element.name, pattern) };
    });
  }

  function search(pattern, { inclusionThreshold }) {
    const scores = scoresFor(pattern);
    const total = scores.reduce((memo, { score }) => Math.max(memo, score), 0);

    return scores
      .filter(({ score }) => score / total >= inclusionThreshold)
      .sort((first, second) => second.score - first.score)
      .map(({ element }) => element);
  }

  return search;
}
