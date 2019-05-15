const { assert } = require('chai');
const sinon = require('sinon');
const { handler } = require('../../../src/lambda/emailServer/notification');
const emailServerTable = require('../../../src/db/emailServerTable');


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
            S: 'UNAVAILABLE',
          },
        },
        StreamViewType: 'NEW_AND_OLD_IMAGES',
        SequenceNumber: '111',
        SizeBytes: 26,
      },
      awsRegion: 'ap-southeast-2',
      eventName: 'MODIFY',
      eventSourceARN: 'arn:aws:dynamodb:ap-southeast-2:account-id:table/ExampleTableWithStream/stream/2015-06-27T00:48:05.899',
      eventSource: 'aws:dynamodb',
    },
  ],
};

describe('Unit Test', () => {
  describe('emailServer - notification', () => {
    const sandbox = sinon.createSandbox();

    afterEach(() => {
      sandbox.restore();
    });

    it('Should check if available email server', async () => {
      const emailServerTableStub = sandbox.stub(emailServerTable, 'listEmailServer').returns([]);

      await handler(event);

      assert.strictEqual(emailServerTableStub.getCall(0).args[0].status, 'AVAILABLE');
    });
  });
});
