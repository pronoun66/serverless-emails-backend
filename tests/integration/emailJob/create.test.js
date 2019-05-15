const { assert } = require('chai');
const request = require('supertest');

const { LOCAL_TEST_URL } = process.env;

describe('Integration Test', () => {
  describe('POST /email', () => {
    it('Should create email job', async () => {
      const res = await request(LOCAL_TEST_URL)
        .post('/email')
        .send({
          from: 'from',
          to: 'to',
          subject: 'subject',
          content: 'content',
        })
        .set('Accept', 'application/json');

      const {
        statusCode,
        body,
      } = res;

      assert.strictEqual(statusCode, 200);
      assert.equal(body.message, 'Sending email is in process');
    });

    it('Failed to create email job while incorrect parameters', async () => {
      const res = await request(LOCAL_TEST_URL)
        .post('/email')
        .send({
          from: 'from',
          to: 'to',
          subject: 'subject',
          content: 'content',
        })
        .set('Accept', 'application/json');

      const {
        statusCode,
        body,
      } = res;

      assert.strictEqual(statusCode, 200);
      assert.equal(body.message, 'Sending email is in process');
    });
  });
});
