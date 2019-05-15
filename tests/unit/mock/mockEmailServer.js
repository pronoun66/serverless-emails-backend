const AbstractEmailServer = require('../../../src/service/emailServer/abstractEmailServer');

class MockEmailServer extends AbstractEmailServer {
  constructor() {
    super('1111', 'MockEmailServer');
  }

  async sendEmail() {
    return true;
  }

  async healthCheck() {
    return true;
  }
}

module.exports = MockEmailServer;
