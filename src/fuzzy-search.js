export default function createFuzzySearch(possibleResults) {
  function calculateScore(string, pattern) {
    let lastMatch = -1;
    const scores = [];

    for (let i = 0; i < string.length; i += 1) {
      scores.push(0.0);
      for (let j = 0; j < pattern.length && i + j < string.length; j += 1) {
        if (string[i + j].toLowerCase() === pattern[j].toLowerCase()) {
          scores[i] += 1 / (Math.abs(i + j - lastMatch) + 1);
          lastMatch = i;
        }
      }
    }

    return scores.reduce((x, y) => Math.max(x, y), 0);
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
