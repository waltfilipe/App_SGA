const path = require('path');
const { createRequestHandler } = require('expo-server/adapter/vercel');

/** Entrada serverless na Vercel — delega rotas ao bundle gerado por `expo export -p web`. */
module.exports = createRequestHandler({
  build: path.join(__dirname, '../dist/server'),
});
