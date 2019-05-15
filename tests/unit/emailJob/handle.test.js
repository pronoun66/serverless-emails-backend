const { assert } = require('chai');
const sinon = require('sinon');
const { handler } = require('../../../src/lambda/emailJob/handle');
const MockEmailServer = require('../mock/mockEmailServer');
const emailServerFactory = require('../../../src/service/emailServerFactory');
const emailJobTable = require('../../../src/db/emailJobTable');


const event = {
  Records: [
    {
      eventID: '1',
      eventVersion: '1.0',
      dynamodb: {
        Keys: {
          id: {
            S: '101',
          },
        },
        NewImage: {
          id: {
            S: '101',
          },
          status: {
            S: 'NEW',
          },
          params: {
            M: {
              from: {
                S: 'from',
              },
              to: {
                S: 'to',
              },
              subject: {
                S: 'subject',
              },
              content: {
                S: 'content',
              },
            },
          },
        },
        StreamViewType: 'NEW_AND_OLD_IMAGES',
        SequenceNumber: '111',
        SizeBytes: 26,
      },
      awsRegion: 'ap-southeast-2',
      eventName: 'INSERT',
      eventSourceARN: 'arn:aws:dynamodb:ap-southeast-2:account-id:table/ExampleTableWithStream/stream/2015-06-27T00:48:05.899',
      eventSource: 'aws:dynamodb',
    },
  ],
};

describe('Unit Test', () => {
  describe('emailJob - handle', () => {
    const sandbox = sinon.createSandbox();

    const mockEmailServer = new MockEmailServer();

    afterEach(() => {
      sandbox.restore();
    });

    it('Should handle email job and update job to DONE', async () => {
      const sendEmailSpy = sandbox.spy(mockEmailServer, 'sendEmail');
      sandbox.stub(emailServerFactory, 'getAvailableEmailServer').returns(mockEmailServer);
      const updateEmailJobStub = sandbox.stub(emailJobTable, 'updateEmailJob');

      await handler(event);

      assert.strictEqual(sendEmailSpy.called, true);
      assert.strictEqual(updateEmailJobStub.getCall(0).args[0].status, 'DONE');
    });

    it('Should update FAILED job when sending email is failed', async () => {
      const sendEmailStub = sandbox.stub(mockEmailServer, 'sendEmail').rejects();
      sandbox.stub(emailServerFactory, 'getAvailableEmailServer').returns(mockEmailServer);
      const updateEmailJobStub = sandbox.stub(emailJobTable, 'updateEmailJob');

      await handler(event);

      assert.strictEqual(!!sendEmailStub.getCall(0), true);
      assert.strictEqual(updateEmailJobStub.getCall(0).args[0].status, 'FAILED');
    });

    it('Should update FAILED job when no emailServer is available', async () => {
      sandbox.stub(emailServerFactory, 'getAvailableEmailServer').throws('No active email servers');
      const updateEmailJobStub = sandbox.stub(emailJobTable, 'updateEmailJob');

      await handler(event);

      assert.strictEqual(updateEmailJobStub.getCall(0).args[0].status, 'FAILED');
    });
  });
});
