var test = require('tape');

const before = test;
const after = test;

// beforeEach/afterEach rely on shared state.
// That's a big anti-pattern for testing.

// It's also silly to run something before and after
// ever test -- many of your tests won't need it.

// Try this, instead:
const setup = () => {
  const fixtures = {};

  // Insert your fixture code here.
  // Make sure you're creating fresh objects each
  // time setup() is called.
  return fixtures;
};

const teardown = (fixtures) => {
  // Dispose of your fixtures here.
};


before('Before', function (assert) {

  assert.pass('Do something before tests here');

  assert.end();
});



test('A test with fixtures', (assert) => {
  const fixture = setup();

  assert.equal(typeof fixture, 'object',
    'fixture should return an object');

  teardown(fixture);
  assert.end();
});


test('A passing test', (assert) => {

  assert.pass('This test will pass.');

  assert.end();
});


test('Assertions with tape.', (assert) => {
  const expected = 'something to test';
  const actual = 'sonething to test';

  assert.equal(actual, expected,
    'Given two mismatched values, .equal() should produce a nice bug report');

  assert.end();
});


after('After', (assert) => {

  assert.pass('Do something after tests here.');

  assert.end();
});