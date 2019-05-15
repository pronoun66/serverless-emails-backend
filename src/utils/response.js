const costumed = (statusCode, body) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});

const ok = body => costumed(200, body);
const badRequest = body => costumed(400, body);
const internalServerError = body => costumed(500, body);

module.exports = {
  ok,
  badRequest,
  internalServerError,
  costumed,
};
