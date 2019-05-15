const { assert } = require('chai');
const sinon = require('sinon');
const { handler } = require('../../../src/lambda/emailJob/create');
const emailJobTable = require('../../../src/db/emailJobTable');


describe('Unit Test', () => {
  describe('emailJob - create', () => {
    it('Should create email job', async () => {
      const event = {
        body: JSON.stringify({
          from: 'from',
          to: 'to',
          subject: 'subject',
          content: 'content',
        }),
      };

      sinon.stub(emailJobTable, 'createEmailJob').resolves();

      const { statusCode, body } = await handler(event);

      assert.strictEqual(statusCode, 200);
      assert.strictEqual(body, JSON.stringify({ message: 'Sending email is in process' }));
    });

    it('Failed to create email job while no from in request ', async () => {
      const event = {
        body: JSON.stringify({
          to: 'to',
          subject: 'subject',
          content: 'content',
        }),
      };
      const { statusCode, body } = await handler(event);
      assert.strictEqual(statusCode, 400);
      assert.match(body, /Cannot send email.*from/);
    });

    it('Failed to create email job while no to in request ', async () => {
      const event = {
        body: JSON.stringify({
          from: 'from',
          subject: 'subject',
          content: 'content',
        }),
      };
      const { statusCode, body } = await handler(event);
      assert.strictEqual(statusCode, 400);
      assert.match(body, /Cannot send email.*to/);
    });

    it('Failed to create email job while no subject in request ', async () => {
      const event = {
        body: JSON.stringify({
          from: 'from',
          to: 'to',
          content: 'content',
        }),
      };
      const { statusCode, body } = await handler(event);
      assert.strictEqual(statusCode, 400);
      assert.match(body, /Cannot send email.*subject/);
    });

    it('Failed to create email job while no content in request ', async () => {
      const event = {
        body: JSON.stringify({
          from: 'from',
          to: 'to',
          subject: 'subject',
        }),
      };
      const { statusCode, body } = await handler(event);
      assert.strictEqual(statusCode, 400);
      assert.match(body, /Cannot send email.*content/);
    });
  });
});
