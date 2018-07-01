const test = require('ava');
const request = require('supertest');
// const app = require('../app');
// const testConfig = require('../util/test-config');

// test.before('connect to Mockgoose', async () => {
//   await connectDB();
// });

test('foo', (t) => {
  t.pass();
});

test('bar', async (t) => {
  const bar = Promise.resolve('bar');
  t.is(await bar, 'bar');
});
