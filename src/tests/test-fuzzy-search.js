import test from 'tape';
import createFuzzySearch from '~/fuzzy-search.js';

const fixture = [
  'algorithms and data structures',
  'automated data mining',
  'computation theory',
];

test('easy case', (assert) => {
  assert.plan(1);

  const actual = createFuzzySearch(fixture)('ads', {
    inclusionThreshold: 0.25,
  });
  const expected = [
    'algorithms and data structures',
    'automated data mining',
  ];

  assert.deepEqual(actual, expected);
});
