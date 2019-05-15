const { assert } = require('chai');
const sinon = require('sinon');
const { handler } = require('../../../src/lambda/emailServer/monitor');
const MockEmailServer = require('../mock/mockEmailServer');
const emailServerFactory = require('../../../src/service/emailServerFactory');
const emailServerTable = require('../../../src/db/emailServerTable');


const event = {};

describe('Unit Test', () => {
  describe('emailServer - monitor', () => {
    const sandbox = sinon.createSandbox();

    const mockEmailServer = new MockEmailServer();

    afterEach(() => {
      sandbox.restore();
    });

    it('Should update email server\'s status when it turns back to available', async () => {
      sandbox.stub(emailServerTable, 'listEmailServer').returns([{ id: mockEmailServer.id, status: 'UNAVAILABLE' }]);
      sandbox.stub(emailServerFactory, 'getEmailServer').returns(mockEmailServer);
      const emailServerStub = sandbox.stub(mockEmailServer, 'updateStatus');

      await handler(event);

      assert.strictEqual(emailServerStub.getCall(0).args[0], 'AVAILABLE');
    });
  });
});
